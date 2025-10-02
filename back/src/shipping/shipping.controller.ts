import { Controller, Post, Get, HttpCode, Param, Body } from '@nestjs/common';
import {CreateShipmentDto} from "./dto/create-shippment.dto";

@Controller('shipping')
export class ShippingController {

    @Post()
    @HttpCode(200)
    createShippingOrder(@Body() ship: CreateShipmentDto) {
        // Logic to create a shipping order
        return { message: 'Shipping order created successfully', 
                    order: ship
         };
    }

    @Get()
    getShippingOrders() {
        // Logic to retrieve shipping orders
        return [{ id: 1, status: 'shipped' }, { id: 2, status: 'pending' }]; // Example data
    }

    @Get(':id')
    getShippingOrderById(@Param('id') id: number) {
        // Logic to retrieve a specific shipping order by ID
        return { id, status: 'shipped' }; // Example data
    }

    @Post(':id/cancel')
    @HttpCode(200)
    cancelShippingOrder(@Param('id') id: number) {
        // Logic to cancel a specific shipping order by ID
        return { message: `Shipping order ${id} canceled successfully` };
    }

    @Post('cost')
    @HttpCode(200)
    calculateShippingCost() {
        // Logic to calculate shipping cost
        return { cost: 10.00 }; // Example fixed cost
    }

    @Get('transport-methods')
    getTransportMethods() {
        // Logic to retrieve available transport methods
        return ['air', 'sea', 'road', 'rail']; // Example transport methods
    }


}
