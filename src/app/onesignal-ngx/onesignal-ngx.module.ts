import { NgModule } from '@angular/core';
import { OneSignal } from 'onesignal-ngx';


@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class OnesignalNgxModule {
  constructor(private oneSignal: OneSignal) {
    // Initialize OneSignal with your configuration here
    this.oneSignal.init({
      appId: '2c5a5061-d42e-43d3-b7ef-edef557b13ac',
    });
  }
}