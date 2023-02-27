import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { nanoid } from 'nanoid'

import { Item } from './item.schema'

export type CartDocument = Document & Cart

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'carts',
})
export class Cart {
  @Prop({
    type: String,
    index: true,
    unique: true,
    default: () => nanoid(5),
  })
  objectId?: string

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  userId: string

  @Prop({
    type: [Object],
    default: [null],
  })
  items: [Item]

  @Prop({
    type: Number,
    required: true,
  })
  totalPrice: number
}

export const CartSchema = SchemaFactory.createForClass(Cart)
