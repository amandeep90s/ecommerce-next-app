import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrderItem {
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  orderDate: string;
}

const orders: OrderItem[] = [
  {
    name: 'Mist Black Triblend',
    image:
      'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/mist-black-triblend.800w.7829cf.avif',
    color: 'White',
    size: 'Medium',
    quantity: 1,
    price: 120,
    orderDate: 'March 18, 2025',
  },
  {
    name: 'Trendy Black T-shirt',
    image:
      'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/trendy-black-t-shirt.800w.f0e01d.avif',
    color: 'Black',
    size: 'Medium',
    quantity: 1,
    price: 90,
    orderDate: 'March 13, 2025',
  },
];

const OrderHistory1 = () => {
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.price, 0);
  const lastOrder = orders.reduce((latest, order) => {
    const currentDate = new Date(order.orderDate);
    const latestDate = new Date(latest);
    return currentDate > latestDate ? order.orderDate : latest;
  }, orders[0].orderDate);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-x-6">
          <div>
            <CardTitle className="text-2xl">Order History</CardTitle>
            <CardDescription className="text-balance">
              View your past orders and their status
            </CardDescription>
          </div>
          <div className="text-muted-foreground text-end text-sm max-sm:text-start">
            <p>Total Orders: {totalOrders}</p>
            <p>Last Order: {lastOrder}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="hidden text-end font-semibold sm:table-cell">
                  Order Date
                </TableHead>
                <TableHead className="hidden text-end font-semibold md:table-cell">
                  Quantity
                </TableHead>
                <TableHead className="text-end font-semibold">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, i) => (
                <TableRow key={i}>
                  <TableCell className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                    <img
                      src={order.image}
                      alt={order.name}
                      className="h-16 w-16 shrink-0 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{order.name}</p>
                      <p className="text-muted-foreground truncate text-sm">{`Color: ${order.color} • Size: ${order.size}`}</p>
                      <p className="text-muted-foreground mt-1 text-xs sm:hidden">
                        {order.orderDate}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-end sm:table-cell">{order.orderDate}</TableCell>
                  <TableCell className="hidden text-end md:table-cell">{order.quantity}</TableCell>
                  <TableCell className="text-end">${order.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-transparent">
              {/* Mobile and Tablet Footer - colSpan={1} */}
              <TableRow className="font-semibold hover:bg-transparent md:hidden">
                <TableCell colSpan={1}></TableCell>
                <TableCell className="text-end">{`$${totalAmount.toFixed(2)}`}</TableCell>
              </TableRow>
              {/* Desktop Footer - colSpan={2} */}
              <TableRow className="hidden font-semibold hover:bg-transparent md:table-row">
                <TableCell colSpan={2}></TableCell>
                <TableCell className="text-end">{`$${totalAmount.toFixed(2)}`}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-4 border-t-0 bg-transparent pt-0">
          <Button variant="default" className="h-9 cursor-pointer px-4 py-2">
            View Order Details
          </Button>
          <Button variant="secondary" className="h-9 cursor-pointer px-4 py-2">
            Download Invoice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderHistory1;
