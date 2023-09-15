import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';
import { ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute,
  ) {

  }
  ngOnInit(): void {
    console.log("App component initialized")

    this.UiUpdate();
    this.http.get("https://hub.dummyapis.com/employee?noofRecords=10&idStarts=1").subscribe(data => {
      this.responseData = data;
    })
    var queryParams = this.queryStringParams();
    if (queryParams) {
      localStorage.setItem('UtmParams', queryParams);
    }
    this.activatedRoute.queryParamMap.subscribe((params) => {
      let storeValue = params.get('store');
      if (storeValue !== null) {
        sessionStorage.setItem('store', storeValue);
      }
      if (storeValue !== null) {
        sessionStorage.setItem('version', storeValue);
      }
      this.checkPWA();
    });
  }

  queryStringParams() { //check there if query strings are there then one by one take in loop and append in one url
    let queryString = '';
  this.activatedRoute.queryParamMap.subscribe((params) => {
    params.keys.forEach((key, index) => {
      const value = params.get(key); // Use get method to retrieve the parameter value
      const splitChar = index === 0 ? '?' : '&';
      queryString += `${splitChar}${key}=${value}`;
    });
  });
  console.log(queryString);
  return queryString;
  }

  checkPWA() {
    debugger
    var properties = {
      Type: 'customLog',
      Name: 'pwa',
      Device: this.getPWADisplayMode(),
      // Value: this.getPWADisplayMode() === 'android' || this.getPWADisplayMode() === 'iOS'|| this.getPWADisplayMode() === 'uwp' ? 'appinstalled' : '',
      Page: window.location.pathname,
      AppVersion: sessionStorage.getItem('version'),
      AppStoreName: sessionStorage.getItem('store')
    };
    console.log(JSON.stringify(properties));
  }

  getPWADisplayMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const userAgent = navigator.userAgent;
    if (document.referrer.startsWith('android-app://')) {
      return 'android';
    }
    else if (userAgent.includes('com.android.vending') || this.isAndroid()) {
      return 'android';
    }
    else if (userAgent.includes('App Store') || this.isiOS()) {
      return 'iOS';
    }
    else if (this.isMicrosoftStoreApp()) {
      return 'uwp';//Universal Windows Platform
    }
    else if (isStandalone) {
      return 'standalone';
    }
    return 'browser';
  }

  isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }
  isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  isMicrosoftStoreApp() {
    return /WindowsApp/i.test(navigator.userAgent);
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
