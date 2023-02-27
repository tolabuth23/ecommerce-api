import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { FilterQuery } from 'mongoose'

import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { Product } from './schema/product.schema'
import { ProductQueryDto } from './dto/product-query.dto'

import { LoggerService } from '../logger/logger.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { RoleEnum } from '../user/enum/role.enum'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

import { PaginationResponseInterface } from '../../interface/pagination.interface'
import { ProductEntity } from './entities/product.entity'

@ApiTags('Product')
@Controller('product')
export class ProductController {
  private readonly logger: LoggerService = new LoggerService(
    ProductController.name,
  )
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({
    description: 'Create product',
  })
  @ApiResponse({
    status: 200,
    description: 'The record is create product already!!!',
  })
  async createProduct(@Query() body: CreateProductDto): Promise<ProductEntity> {
    try {
      return this.productService.createProduct(body)
    } catch (e) {
      this.logger.error(
        `catch on create product: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({
    description: 'Get all product',
  })
  @ApiResponse({
    status: 200,
    description: 'The record is get all product!!!',
  })
  async getProducts(
    @Query() body: ProductQueryDto,
  ): Promise<PaginationResponseInterface<ProductEntity>> {
    const { page, perPage, sort, key } = body

    try {
      let conditions: FilterQuery<Product>
      if (key) {
        conditions = { category: key }
      } else {
        conditions = {}
      }
      const [records, count] = await this.productService.getPagination(
        conditions,
        { page, perPage },
        sort,
      )
      return {
        page,
        perPage,
        count,
        records,
      }
    } catch (e) {
      this.logger.error(
        `catch on getAllProduct: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Get(':objectId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({
    description: 'Get by ObjectId',
  })
  @ApiResponse({
    description: 'The record is get product!!!',
  })
  async getByObjectId(
    @Param('objectId') objectId: string,
  ): Promise<ProductEntity> {
    try {
      return this.productService.getByObjectId(objectId)
    } catch (e) {
      this.logger.error(
        `catch on getByObjectId:${e?.message ?? JSON.stringify(e)}}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Put(':objectId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({
    description: 'update product',
  })
  @ApiResponse({
    status: 200,
    description: 'The records is update product!!!',
  })
  async update(
    @Param('objectId') objectId: string,
    @Query() body: CreateProductDto,
  ): Promise<void> {
    try {
      await this.productService.update(objectId, body)
    } catch (e) {
      this.logger.error(`catch on update: ${e?.message ?? JSON.stringify(e)}`)
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }

  @Delete(':objectId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({
    description: 'Delete product!!',
  })
  @ApiResponse({
    status: 200,
    description: 'The record is delete already!!!',
  })
  async delete(@Param('objectId') objectId: string): Promise<void> {
    try {
      await this.productService.deleteProduct(objectId)
    } catch (e) {
      this.logger.error(
        `catch on delete product: ${e?.message ?? JSON.stringify(e)}`,
      )
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      })
    }
  }
}
