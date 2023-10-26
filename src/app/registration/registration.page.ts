import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { User } from '../models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  user = {} as User;
  constructor(private toastCtrl: ToastController
    , private loadingCtrl: LoadingController
    , private afAuth: AngularFireAuth
    , private navCtrl: NavController
    , private firestore: AngularFirestore) { }

  ngOnInit() {
  }
  Alumnos = {} as User;
  //CREAR USUARIO
  async registrar(user: User) {
    //LLAMAMOS LA FUNCION VALIDAR FORMULARIO
    if (this.formValidation()) {
      let loader = this.loadingCtrl.create({
        message: "Espere un momento..."
      });
      (await loader).present();
      try {
        await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).
          then(data => {
            console.log('Guardado con éxito',data);
            //Redireccionamos al home
            this.navCtrl.navigateRoot("account");
          });
        await this.firestore.collection("Alumnos").add(user)
      }
      catch (e) {
        this.showToast(e);
      }
      //Despachamos el loader
      (await loader).dismiss();
    }
  }
  //VALIDAMOS LA INFORMACIÓN DEL REGISTRO
  formValidation() {
    if (!this.user.email) {
      this.showToast("Ingresa un correo!");
      return false;
    }
    if (!this.user.password) {
      this.showToast("Ingrese su contraseña!");
      return false;
    }
    return true;
  }
  //MOSTRAMOS EL LOADER
  showToast(message: string) {
    this.toastCtrl.
      create({
        message: message,
        duration: 3000
      }).then(toastData => toastData.present())
  }
}
