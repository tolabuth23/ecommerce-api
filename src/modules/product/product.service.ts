import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { Product, ProductDocument } from './schema/product.schema'
import { CreateProductDto } from './dto/create-product.dto'

@Injectable()
export class ProductService {
  @InjectModel(Product.name)
  private readonly productModel: Model<ProductDocument>

  async createProduct(body: CreateProductDto): Promise<ProductDocument> {
    return this.productModel.create(body)
  }

  async getByObjectId(objectId: string): Promise<ProductDocument> {
    return this.productModel
      .findOne({ objectId })
      .select({ _id: 0, objectId: 0 })
      .lean()
  }

  async update(objectId: string, body: CreateProductDto): Promise<void> {
    await this.productModel.updateOne({ objectId }, body, { new: true })
  }

  async getPagination(
    conditions: FilterQuery<Product>,
    pagination: { page: number; perPage: number },
    sort: { [key: string]: number } | string = { _id: 1 },
  ): Promise<[Product[], number]> {
    const { page = 1, perPage = 20 } = pagination
    return Promise.all([
      this.productModel
        .find(conditions)
        .select({ _id: 0, objectId: 0 })
        .sort(sort)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.productModel.countDocuments(conditions),
    ])
  }

  async deleteProduct(objectId: string): Promise<void> {
    await this.productModel.findByIdAndDelete({ objectId: objectId })
  }
}
