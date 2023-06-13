export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
  CANCELED = 'CANCELED',

  // TODO: move to a payment Aggregate
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
  PAYMENT_ERROR = 'PAYMENT_ERROR',

  // TODO: move to a delivery Aggregate
  DELIVERY_PENDING = 'DELIVERY_PENDING',
  DELIVERY_IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  DELIVERY_IN_ROUTE = 'DELIVERY_IN_ROUTE',
  DELIVERED = 'DELIVERED',
  DELIVERY_ERROR = 'DELIVERY_ERROR',
}

export const OrderStatusText = {
  [OrderStatus.DRAFT]: 'Rascunho',
  [OrderStatus.PENDING_APPROVAL]: 'Aguardando aprovação',
  [OrderStatus.APPROVED]: 'Aprovado',
  [OrderStatus.DISAPPROVED]: 'Reprovado',
  [OrderStatus.CANCELED]: 'Cancelado',
  [OrderStatus.PAYMENT_PENDING]: 'Pagamento pendente',
  [OrderStatus.PAYMENT_APPROVED]: 'Pagamento aprovado',
  [OrderStatus.PAYMENT_ERROR]: 'Pagamento com erro',
  [OrderStatus.DELIVERY_PENDING]: 'Entrega pendente',
  [OrderStatus.DELIVERY_IN_PROGRESS]: 'Entrega em progresso',
  [OrderStatus.DELIVERY_IN_ROUTE]: 'Entrega em rota',
  [OrderStatus.DELIVERED]: 'Entregue',
  [OrderStatus.DELIVERY_ERROR]: 'Entrega com erro',
}
