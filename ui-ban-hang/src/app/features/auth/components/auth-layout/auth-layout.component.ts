import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container-fluid g-0 vh-100 overflow-hidden">
      <div class="row g-0 h-100">
        
        <!-- Left Side (Black Context) -->
        <div class="col-lg-6 bg-black text-white p-5 d-none d-lg-flex flex-column justify-content-between h-100">
          <div class="brand">
            <h1 class="display-4 fw-bold tracking-wider">MABIXI</h1>
          </div>
          
          <div class="intro" style="max-width: 450px;">
            <h2 class="display-6 fw-semibold mb-4 text-white">MABIXI - Giá thì đắt, nhưng mà chất</h2>
            <p class="text-secondary fs-5">
              Khám phá bộ sưu tập đồ ăn vặt đắt đỏ và hiện đại, thiết kế độc quyền để mang lại sự ngon miệng và sang trọng cho vị giác của bạn.
            </p>
          </div>
        </div>

        <!-- Right Side (Light Action Area) -->
        <div class="col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5 bg-light h-100 overflow-y-auto">
          <div class="w-100" style="max-width: 450px;">
            <router-outlet></router-outlet>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .tracking-wider { letter-spacing: 0.1em; }
    .bg-black { background-color: #000 !important; }
  `]
})
export class AuthLayoutComponent { }
