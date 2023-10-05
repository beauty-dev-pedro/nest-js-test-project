import { Controller, UseGuards, Get, Post, Delete, Patch, Param, ParseIntPipe, Body, HttpCode, HttpStatus} from '@nestjs/common';
import { ShopifyService } from './shopify.service';

@Controller('shopify')
export class ShopifyController {
    constructor(private shopifyService: ShopifyService,) {}

    @Get('products')
    getBookmarks() {
        console.log('calling service');
        return this.shopifyService.findProducts();
    }

    @Get('shop')
    getProducts() {
        console.log('calling service');
        return this.shopifyService.findShopifyProducts();
    }
} 
