import { Prop, Schema } from '@nestjs/mongoose'
import { nanoid } from 'nanoid'

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'items',
  _id: false,
})
export class Item {
  @Prop({
    type: String,
    index: true,
    unique: true,
    default: () => nanoid(5),
  })
  objectId?: string

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  productId: string

  @Prop({
    type: String,
    required: true,
  })
  itemName: string

  @Prop({
    type: Number,
    required: true,
  })
  quantity: number

  @Prop({
    type: Number,
    required: true,
  })
  price: number

  @Prop({
    type: Number,
    required: true,
  })
  subTotalPrice: number
}
