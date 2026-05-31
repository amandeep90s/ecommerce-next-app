'use client';

import {
  ArrowLeft,
  Check,
  Gift,
  Loader2,
  Lock,
  MapPin,
  Plus,
  Shield,
  Tag,
  Truck,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cartItemKey, clearCart, selectCartItems, selectCartTotal } from '@/features/app/cartSlice';
import { useGetAddresses } from '@/features/customer/hooks/use-addresses';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface AppliedCoupon {
  code: string;
  discount: number; // percentage
  minimumPurchase: number;
}

export function CheckoutView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved addresses
  const { data: addressesData } = useGetAddresses();
  const addresses = useMemo(() => addressesData?.data ?? [], [addressesData]);
  const defaultAddress = useMemo(
    () => addresses.find((a) => a.is_default) ?? addresses[0] ?? null,
    [addresses],
  );

  // forcedMode = null means auto: 'saved' if addresses exist, else 'new'
  const [forcedMode, setForcedMode] = useState<'saved' | 'new' | null>(null);
  // userSelectedId = '' means fall back to the default address
  const [userSelectedId, setUserSelectedId] = useState<string>('');

  // Derived values — no useEffect needed
  const addressMode = forcedMode ?? (addresses.length > 0 ? 'saved' : 'new');
  const selectedAddressId = userSelectedId || defaultAddress?.id.toString() || '';

  // Coupon state
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    note: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Pricing
  const subtotal = cartTotal;
  const shipping = subtotal > 75 ? 0 : 15.99;
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal + shipping - couponDiscount;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Coupon apply
  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return;

    setCouponLoading(true);
    try {
      const response = await fetchWithAuth('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim(), subtotal }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Invalid coupon code');
        return;
      }

      setAppliedCoupon(result.data);
      toast.success(`Coupon "${result.data.code}" applied — ${result.data.discount}% off!`);
    } catch {
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromoCode('');
    toast.info('Coupon removed');
  };

  // Get the shipping address based on mode
  function getShippingAddress() {
    if (addressMode === 'saved' && selectedAddressId) {
      const addr = addresses.find((a) => a.id.toString() === selectedAddressId);
      if (addr) {
        return {
          name: addr.name,
          phone: addr.phone,
          address_line1: addr.address_line1,
          address_line2: addr.address_line2 ?? '',
          city: addr.city,
          state: addr.state,
          postal_code: addr.postal_code,
          country: addr.country,
        };
      }
    }
    return {
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      address_line1: formData.address,
      address_line2: formData.address2,
      city: formData.city,
      state: formData.state,
      postal_code: formData.zipCode,
      country: formData.country,
    };
  }

  // Validate step 1
  function isStep1Valid() {
    if (!formData.email || !formData.firstName || !formData.lastName) return false;
    if (addressMode === 'saved') return !!selectedAddressId;
    return !!(formData.address && formData.city && formData.state && formData.zipCode);
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);

    try {
      const shippingAddress = getShippingAddress();

      const response = await fetchWithAuth('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            name: item.name,
            price: item.price,
            selling_price: item.selling_price,
            image: item.image,
            quantity: item.quantity,
            color: item.color ?? null,
            size: item.size ?? null,
            sku: item.sku ?? null,
          })),
          shippingAddress,
          customerSnapshot: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
          },
          couponCode: appliedCoupon?.code,
          note: formData.note,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || 'Failed to create checkout session');
        return;
      }

      dispatch(clearCart());

      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-muted/30">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart to checkout.</p>
          <Button onClick={() => router.push('/shop')} className="cursor-pointer">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // Get selected address for review step
  const selectedAddress =
    addressMode === 'saved' ? addresses.find((a) => a.id.toString() === selectedAddressId) : null;

  return (
    <div className="bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-balance">Secure Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase in just a few steps</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-4">
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    stepNumber <= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 2 ? (
                  <div
                    className={`mx-4 h-1 w-16 rounded transition-colors ${
                      stepNumber < step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-balance">
                  {step === 1 && 'Contact & Shipping Information'}
                  {step === 2 && 'Review & Pay'}
                </CardTitle>
                <CardDescription>
                  {step === 1 && 'Enter your contact details and shipping address'}
                  {step === 2 && 'Review your order and proceed to secure payment'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* Step 1: Contact & Shipping */}
                {step === 1 ? (
                  <div className="flex flex-col gap-4">
                    {/* Contact fields */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="checkout-email">Email address</Label>
                      <Input
                        id="checkout-email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="checkout-firstName">First name</Label>
                        <Input
                          id="checkout-firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="checkout-lastName">Last name</Label>
                        <Input
                          id="checkout-lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="checkout-phone">Phone number</Label>
                      <Input
                        id="checkout-phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <Separator />

                    {/* Address Selection */}
                    <div className="flex flex-col gap-3">
                      <Label className="text-base font-medium">Shipping Address</Label>

                      {addresses.length > 0 && (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={addressMode === 'saved' ? 'default' : 'outline'}
                            size="sm"
                            className="cursor-pointer gap-1"
                            onClick={() => setForcedMode('saved')}
                          >
                            <MapPin className="size-3" />
                            Saved Addresses
                          </Button>
                          <Button
                            type="button"
                            variant={addressMode === 'new' ? 'default' : 'outline'}
                            size="sm"
                            className="cursor-pointer gap-1"
                            onClick={() => setForcedMode('new')}
                          >
                            <Plus className="size-3" />
                            New Address
                          </Button>
                        </div>
                      )}

                      {/* Saved Addresses List */}
                      {addressMode === 'saved' && addresses.length > 0 && (
                        <RadioGroup
                          value={selectedAddressId}
                          onValueChange={setUserSelectedId}
                          className="flex flex-col gap-3"
                        >
                          {addresses.map((addr) => (
                            <label
                              key={addr.id.toString()}
                              className={cn(
                                'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                                selectedAddressId === addr.id.toString()
                                  ? 'border-primary bg-primary/5'
                                  : 'hover:bg-muted/50',
                              )}
                            >
                              <RadioGroupItem value={addr.id.toString()} className="mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{addr.name}</span>
                                  {addr.is_default && (
                                    <Badge variant="secondary" className="text-xs">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                  {addr.address_line1}
                                  {addr.address_line2 ? `, ${addr.address_line2}` : ''}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                                </p>
                                <p className="text-muted-foreground text-xs">{addr.phone}</p>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                      )}

                      {/* New Address Form */}
                      {addressMode === 'new' && (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="checkout-address">Street address</Label>
                            <Input
                              id="checkout-address"
                              placeholder="123 Main Street"
                              value={formData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              className="h-9"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label htmlFor="checkout-address2">
                              Apartment, suite, etc. (optional)
                            </Label>
                            <Input
                              id="checkout-address2"
                              placeholder="Apt 4B"
                              value={formData.address2}
                              onChange={(e) => handleInputChange('address2', e.target.value)}
                              className="h-9"
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="checkout-city">City</Label>
                              <Input
                                id="checkout-city"
                                placeholder="New York"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className="h-9"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="checkout-state">State</Label>
                              <Input
                                id="checkout-state"
                                placeholder="NY"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                className="h-9"
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="checkout-zipCode">ZIP code</Label>
                              <Input
                                id="checkout-zipCode"
                                placeholder="10001"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                className="h-9"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="checkout-country">Country</Label>
                              <Select
                                value={formData.country}
                                onValueChange={(value) => handleInputChange('country', value)}
                              >
                                <SelectTrigger
                                  id="checkout-country"
                                  className="mt-2 h-9! w-full py-3"
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  <SelectItem value="US">United States</SelectItem>
                                  <SelectItem value="CA">Canada</SelectItem>
                                  <SelectItem value="UK">United Kingdom</SelectItem>
                                  <SelectItem value="AU">Australia</SelectItem>
                                  <SelectItem value="IN">India</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="checkout-note">Order note (optional)</Label>
                      <Input
                        id="checkout-note"
                        placeholder="Any special instructions..."
                        value={formData.note}
                        onChange={(e) => handleInputChange('note', e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                ) : null}

                {/* Step 2: Review & Pay */}
                {step === 2 ? (
                  <div className="flex flex-col gap-6">
                    {/* Shipping Details Summary */}
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 text-sm font-medium">Shipping to:</h3>
                      {addressMode === 'saved' && selectedAddress ? (
                        <>
                          <p className="text-muted-foreground text-sm">{selectedAddress.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {selectedAddress.address_line1}
                          </p>
                          {selectedAddress.address_line2 && (
                            <p className="text-muted-foreground text-sm">
                              {selectedAddress.address_line2}
                            </p>
                          )}
                          <p className="text-muted-foreground text-sm">
                            {selectedAddress.city}, {selectedAddress.state}{' '}
                            {selectedAddress.postal_code}
                          </p>
                          <p className="text-muted-foreground text-sm">{selectedAddress.phone}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-muted-foreground text-sm">
                            {formData.firstName} {formData.lastName}
                          </p>
                          <p className="text-muted-foreground text-sm">{formData.address}</p>
                          {formData.address2 && (
                            <p className="text-muted-foreground text-sm">{formData.address2}</p>
                          )}
                          <p className="text-muted-foreground text-sm">
                            {formData.city}, {formData.state} {formData.zipCode}
                          </p>
                        </>
                      )}
                      <p className="text-muted-foreground text-sm">{formData.email}</p>
                    </div>

                    {/* Payment Info */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                      <div className="flex items-center gap-2">
                        <Shield className="size-5 text-blue-600" />
                        <p className="text-sm font-medium">Secure Payment via Stripe</p>
                      </div>
                      <p className="text-muted-foreground mt-1 text-xs">
                        You will be redirected to Stripe&apos;s secure checkout page to complete
                        your payment. Your card details are never stored on our servers.
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="flex h-9 cursor-pointer items-center gap-2 px-4 py-2"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>

                  {step < 2 ? (
                    <Button
                      onClick={nextStep}
                      className="h-9 cursor-pointer px-4 py-2"
                      disabled={!isStep1Valid()}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className="flex h-9 cursor-pointer items-center gap-2 px-4 py-2"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Lock className="size-4" />
                      )}
                      {isLoading ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-balance">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Items */}
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div key={cartItemKey(item)} className="flex gap-4">
                      <div className="relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="size-16 rounded-lg object-cover"
                        />
                        <Badge
                          variant="secondary"
                          className="absolute -inset-e-2 -top-2 size-6 rounded-full p-0 px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium">{item.name}</h4>
                        {(item.color || item.size) && (
                          <p className="text-muted-foreground text-xs">
                            {[item.color, item.size].filter(Boolean).join(' / ')}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                        <p className="mt-1 text-sm font-medium">
                          ${(item.selling_price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon Code */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="checkout-promoCode" className="text-sm">
                    Coupon code
                  </Label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900 dark:bg-green-950/30">
                      <div className="flex items-center gap-2">
                        <Check className="size-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-500">
                          (-{appliedCoupon.discount}%)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 cursor-pointer"
                        onClick={handleRemoveCoupon}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        id="checkout-promoCode"
                        placeholder="Enter code"
                        value={promoCode}
                        className="h-9"
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <Button
                        variant="outline"
                        className="h-9 cursor-pointer px-4 py-2"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !promoCode.trim()}
                      >
                        {couponLoading ? <Loader2 className="size-4 animate-spin" /> : 'Apply'}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="size-3" />
                      Shipping
                    </span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="size-3" />
                        Coupon ({appliedCoupon.discount}% off)
                      </span>
                      <span>-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col gap-3 pt-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Shield className="size-4 text-green-600" />
                    <span>SSL encrypted checkout</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Truck className="size-4 text-blue-600" />
                    <span>Free shipping on orders over $75</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Gift className="size-4 text-purple-600" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
