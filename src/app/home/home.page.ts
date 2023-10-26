import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { apiclima } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const API_URL = apiclima.API_URL;
const API_KEY = apiclima.API_KEY;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  weatherTemp: any;
  todayDate = new Date()
  cityName: any;
  weatherIcon: any;
  weatherDetails: any;

  posts: any;
  constructor(private loadingCtrl: LoadingController
             ,private toastCtrl: ToastController
             ,private firestore: AngularFirestore
             ,public httpClient: HttpClient) {
              this.loadData()
             }
  ionViewWillEnter(){

  }
  loadData(){
    this.httpClient.get(`${API_URL}/weather?q=${"Concepción"}&appid=${API_KEY}`)
    .subscribe(results => {
      console.log(results);
      this.weatherTemp = results['main']
      this.cityName = results['name']
      console.log(this.weatherTemp)
      this.weatherDetails = results['weather'][0]
      console.log(this.weatherDetails)
      this.weatherIcon = `http://openweathermap.org/img/wn/${this.weatherDetails.icon}@4x.png`
    })
  }
  //MOSTRAR LOS POST DE LA APLICACION
  //async getPosts(){
     //Mostramos Loader
    // let loader = this.loadingCtrl.create({
    //  message: "Espere un momento..."
    //});
    //(await loader).present();

    //try {
      //this.firestore.collection("posts")
      //.snapshotChanges().subscribe(data => {
        //this.posts = data.map(e => {
          //return {
            //id: e.payload.doc.id,
            //title: e.payload.doc.data()["Title"],
            //details: e.payload.doc.data()["Details"]
          //}
        //})
      //});
    //} catch (e) {
      //this.showToast(e);
    //}
  //}

  /*showToast(message: string){
      this.toastCtrl.
      create({
      message: message,
      duration: 1
    }).then(toastData => toastData.present())
  }*/
}
