import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  shippingCosts!: Observable<{ type: string; price: number }[]>;

  ngOnInit(): void {
    this.shippingCosts = this.cartService.getShippingPrices();
  }
  items = this.cartService.getItems();

  checkoutForm = this.formBuilder.group({
    shipping: [0.0, Validators.required],
    name: ['', Validators.required],
    address: ['', Validators.required],
  });

  get hasShippinCost() {
    return (this.checkoutForm.get('shipping') as FormControl).valid;
  }

  get shippingCost() {
    return (this.checkoutForm.get('shipping') as FormControl).value;
  }

  get totalCost() {
    var result: number = 0.0;
    for (let item of this.items) {
      result += item.price;
    }
    if (this.hasShippinCost) {
      result += Number(this.shippingCost);
    }
    return result;
  }
  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder
  ) {}

  onSubmit(): void {
    // Process checkout data here
    this.items = this.cartService.clearCart();
    console.warn('Your order has been submitted', this.checkoutForm.value);
    this.checkoutForm.reset();
  }
}
