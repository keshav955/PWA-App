import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';
import { OneSignal } from 'onesignal-ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'PWA-App';
  responseData: any;

  constructor(
    private http: HttpClient,
    private swUpdate: SwUpdate,
    private oneSignal:OneSignal
  ) {
    this.oneSignal.init({
      appId: "2c5a5061-d42e-43d3-b7ef-edef557b13ac",
 });
  }
  ngOnInit(): void {
    console.log("App component initialized")

    this.UiUpdate();
    this.http.get("https://hub.dummyapis.com/employee?noofRecords=10&idStarts=1").subscribe(data => {
      this.responseData = data;
    })
  }

  UiUpdate() {
    if (!this.swUpdate.isEnabled) {
      console.log("update is not enabled")
      return;
    }
    this.swUpdate.versionUpdates.subscribe((e) => {
      console.log(`update version`, e)
      if (e.type == "VERSION_DETECTED") {
        if (confirm('New version avilable for app please update')) {

          // this.swUpdate.activateUpdate().then(() => {
            location.reload()
          //   console.log('App has been updated.'); // Handle the update as needed
          // }).catch(error => {
          //   console.error('Error during update:', error); // Handle any errors during the update process
          // });
        }

      }

    });

  }


}
