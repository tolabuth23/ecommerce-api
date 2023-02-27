import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Cart } from './schema/cart.schema'
import { ItemDto } from './dto/create-item.dto'

@Injectable()
export class CartService {
  @InjectModel(Cart.name) private readonly cartModel: Model<Cart>

  async addItemToCart(userId: string, itemDto: ItemDto): Promise<void> {
    const { productId, quantity, price } = itemDto
    const subTotalPrice = quantity * price

    const cart = await this.getCartByUserId(userId)

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId,
      )

      if (itemIndex > -1) {
        const item = cart.items[itemIndex]
        item.quantity = item.quantity + quantity
        item.subTotalPrice = item.quantity * price

        cart.items[itemIndex] = item
        console.log('Check data of cart: ', cart)
        this.recalculateCart(cart)
        await this.cartModel.updateOne({ userId: userId }, cart, { new: true })
        console.log('after data recalculateCart: ', cart)
      } else {
        cart.items.push({ ...itemDto, subTotalPrice })
        this.recalculateCart(cart)
        await this.cartModel.updateOne({ userId: userId }, cart, { new: true })
      }
    } else {
      await this.createCart(userId, itemDto, subTotalPrice, price)
    }
  }

  private recalculateCart(cart: Cart) {
    cart.totalPrice = 0
    cart.items.forEach((item) => {
      cart.totalPrice += item.price * item.quantity
    })
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    return this.cartModel.findOne({ userId })
  }

  async createCart(
    userId: string,
    itemDto: ItemDto,
    subTotalPrice: number,
    totalPrice: number,
  ): Promise<Cart> {
    return this.cartModel.create({
      userId,
      items: [{ ...itemDto, subTotalPrice }],
      totalPrice,
    })
  }

  async removeItemCart(userId: string, productId: string): Promise<void> {
    const cart = await this.getCartByUserId(userId)
    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId,
    )
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1)
      await this.cartModel.updateOne({ userId }, cart, { new: true })
    }
  }
}
