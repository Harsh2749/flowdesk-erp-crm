
/*
import { productRepository, ProductListFilters } from '../repositories/product.repository';
import { ProductResponseDto, toProductResponse } from '../dto/product/product.dto';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';
import { ConflictError, NotFoundError } from '../errors/AppError';
import { PaginatedResult, buildPaginationMeta, toSkipTake } from '../interfaces/pagination.interface';

export const productService = {
  async create(input: CreateProductInput): Promise<ProductResponseDto> {
    const existingSku = await productRepository.findBySku(input.sku);
    if (existingSku) throw new ConflictError(`SKU '${input.sku}' already exists`);

    const product = await productRepository.create({
      ...input,
      currentStock: input.currentStock ?? 0,
      minStock: input.minStock ?? 0,
    });
    return toProductResponse(product);
  },

  async update(id: string, input: UpdateProductInput): Promise<ProductResponseDto> {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError('Product not found');

    if (input.sku && input.sku !== existing.sku) {
      const skuTaken = await productRepository.findBySku(input.sku);
      if (skuTaken) throw new ConflictError(`SKU '${input.sku}' already exists`);
    }

    const product = await productRepository.update(id, input);
    return toProductResponse(product);
  },

  async getById(id: string): Promise<ProductResponseDto> {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    return toProductResponse(product);
  },

  async delete(id: string): Promise<void> {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError('Product not found');
    await productRepository.delete(id);
  },

  async list(
    filters: ProductListFilters,
    page: number,
    limit: number
  ): Promise<PaginatedResult<ProductResponseDto>> {
    const where = productRepository.buildWhere(filters);
    const { skip, take } = toSkipTake(page, limit);

    const [products, total] = await Promise.all([
      productRepository.findMany(where, skip, take, filters.lowStockOnly),
      productRepository.count(where, filters.lowStockOnly),
    ]);

    return {
      data: products.map(toProductResponse),
      meta: buildPaginationMeta(page, limit, total),
    };
  },
};

*/
import { productRepository, ProductListFilters } from '../repositories/product.repository';
import { ProductResponseDto, toProductResponse } from '../dto/product/product.dto';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';
import { ConflictError, NotFoundError } from '../errors/AppError';
import { PaginatedResult, buildPaginationMeta, toSkipTake } from '../interfaces/pagination.interface';

export const productService = {
  async create(input: CreateProductInput): Promise<ProductResponseDto> {
    const existingSku = await productRepository.findBySku(input.sku);
    if (existingSku) throw new ConflictError(`SKU '${input.sku}' already exists`);

    const product = await productRepository.create({
      ...input,
      currentStock: input.currentStock ?? 0,
      minStock: input.minStock ?? 0,
    });
    return toProductResponse(product);
  },

  async update(id: string, input: UpdateProductInput): Promise<ProductResponseDto> {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError('Product not found');

    if (input.sku && input.sku !== existing.sku) {
      const skuTaken = await productRepository.findBySku(input.sku);
      if (skuTaken) throw new ConflictError(`SKU '${input.sku}' already exists`);
    }

    const product = await productRepository.update(id, input);
    return toProductResponse(product);
  },

  async getById(id: string): Promise<ProductResponseDto> {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    return toProductResponse(product);
  },

  async delete(id: string): Promise<void> {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError('Product not found');

    const hasHistory = await productRepository.hasTransactionHistory(id);
    if (hasHistory) {
      throw new ConflictError(
        `'${existing.name}' has existing inventory movements or sales challan history and cannot be permanently deleted. Deactivate it instead to hide it from active listings while preserving that history.`
      );
    }

    await productRepository.delete(id);
  },

  async setActive(id: string, isActive: boolean): Promise<ProductResponseDto> {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError('Product not found');

    const product = await productRepository.setActive(id, isActive);
    return toProductResponse(product);
  },

  async list(
    filters: ProductListFilters,
    page: number,
    limit: number
  ): Promise<PaginatedResult<ProductResponseDto>> {
    const where = productRepository.buildWhere(filters);
    const { skip, take } = toSkipTake(page, limit);

    const [products, total] = await Promise.all([
      productRepository.findMany(where, skip, take, filters.lowStockOnly),
      productRepository.count(where, filters.lowStockOnly),
    ]);

    return {
      data: products.map(toProductResponse),
      meta: buildPaginationMeta(page, limit, total),
    };
  },
};