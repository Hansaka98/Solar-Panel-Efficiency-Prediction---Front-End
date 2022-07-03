//app.component.ts

import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader} from '@agm/core';
import { InitService } from './init/init.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  pageLoader = false;
  modelNumber = 1;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  model2ResutList: any[] = [];
  model1ResutList = '';
  isResultSuccess = false;
  myBirthday = new Date();
  datePickerConfig = {
    format: 'DD'
  };
  selectedEndDate = new Date();
  selectedStartDate = new Date();
  validationFailedStart = false;
  validationFailedEnd = false;
  validationFailed = false;

  state ="";
  sensor ="";
  presentQ = 0;
  sunlight = 0;
  numbrOfPannels = 0;
  kwTotal = 0;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _InitService: InitService
  ) { }


  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      console.log(this.searchElementRef.nativeElement.value);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.address = place.formatted_address;
          this.zoom = 12;
        });
      });
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }


  markerDragEnd($event: any) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  isValidModel1Data(){
    return this.address && this.sensor && this.presentQ && this.sunlight && this.numbrOfPannels && this.kwTotal;
  }

  predict(){
    this.pageLoader = true;
    setTimeout(() => {
      this.pageLoader = false;
    }, 5000);
  }

  setModel(model){
    this.isResultSuccess = false  ;
    this.validationFailed = false;
    this.modelNumber = parseInt(model);
  }

  predictApi() {
    console.log(this.selectedStartDate);
    console.log(this.selectedEndDate);
    let valid = true;
    this.isResultSuccess = false;
    const body = {
      model: this.modelNumber,
      start: this.selectedStartDate,
      end: this.selectedEndDate
    }
    this.pageLoader = true;
    if(this.modelNumber === 2){
      if(!(this.validationFailedStart && this.validationFailedEnd)){
        valid = false;
      }
    }
    if(this.modelNumber === 1){
      if(!(this.isValidModel1Data())){
        valid = false;
      }else{
        const model1Data = [];
        model1Data.push(this.address.split(',').join(''));
        model1Data.push(this.sensor);
        model1Data.push(this.presentQ);
        model1Data.push(this.sunlight);
        model1Data.push(this.numbrOfPannels);
        model1Data.push(this.latitude);
        model1Data.push(this.longitude);
        model1Data.push(this.kwTotal);
        body['data']= model1Data;
      }
    }
    if(valid){
      this._InitService.predictApi(body).subscribe(
        (res) => {
          if (res) {
            this.isResultSuccess = true;
            if(this.modelNumber === 2){
              this.model2ResutList = [];
              for(let item of Object.entries(res)){
                this.model2ResutList.push({name: item[0], value: item[1]});
              }
            }else{
              this.model1ResutList = res;
            }
            this.pageLoader = false;
          }
        });
    }else{
      this.pageLoader = false;
      this.validationFailed = true;
    }

    }

    dataStartonChange(event){
      this.validationFailedStart = true
      this.validationFailed = false;
      this.selectedStartDate = event.target.value;
    }

    dataEndonChange(event){
      this.validationFailedEnd = true;
      this.validationFailed = false;
      this.selectedEndDate = event.target.value;
    }
}