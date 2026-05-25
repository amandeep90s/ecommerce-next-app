interface OrderDetailViewProps {
  id: string;
}

export function OrderDetailView({ id }: OrderDetailViewProps) {
  return <div>Order Detail: {id}</div>;
}
