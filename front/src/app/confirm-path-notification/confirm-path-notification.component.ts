import { Component } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';
import { ServerMessage } from 'src/model/ServerMessage';
import { Status } from 'src/model/Status';
import { Drone } from 'src/model/Drone';

@Component({
  selector: 'app-confirm-path-notification',
  templateUrl: './confirm-path-notification.component.html',
  styleUrls: ['./confirm-path-notification.component.sass']
})
export class ConfirmPathNotificationComponent {
  public cond = true;






  public notification: string[] = [];

  constructor(private socket: WebSocketService) {
    this.socket.subToMapUpdate().subscribe((v: Status) => {
        const status = v;
        status.changed.forEach((c) => {
            this.notification.push(`Path modified for drone ${c}`);
            setTimeout(
              () => this.notification.pop(),
              30000
            );
        })
    })
  }

//Αρχικά, χρειάζεται να έχουμε μια μεταβλητή η οποία θα αποθηκεύει την απάντηση του χρήστη, οπότε θα δηλώσουμε μια μεταβλητή userResponse στην αρχή της κλάσης μας ως εξής:
//First, we need to have a variable that will store the user's response, so we'll declare a userResponse variable at the beginning of our class like this:

userResponse: boolean | undefined;

//Επειδή η τιμή της userResponse αρχικά δεν είναι γνωστή, τη δηλώνουμε ως undefined.
//Because the value of userResponse is initially not known, we declare it as undefined.

//Έπειτα, όταν ο χρήστης πατάει το κουμπί, η μέθοδος sendAnswerPath() καλείται με την απάντηση του χρήστη ως παράμετρο.
//Then, when the user presses the button, the sendAnswerPath() method is called with the user's answer as a parameter.
//Εκεί μπορούμε να θέσουμε την τιμή της userResponse σύμφωνα με την απάντηση του χρήστη ως εξής:
//There we can set the value of userResponse according to the user response as follows:

sendAnswerPath(response: boolean): Promise<void> {
  console.log("Answering the path");
  this.notification.pop();
  return this.socket?.sendAnswerPath(response);

  /*
  // Θέτουμε την τιμή της userResponse  // Set the value of userResponse
  this.userResponse = response;

  if (this.socket) {
    return new Promise((resolve, reject): void => {
      resolve();
      // @ts-ignore
      setTimeout(
        (handler: () => reject(new Error("Timeout"))),
        (timeout: 5000)
      );
    });
  } else {
    return new Promise((executor: (resolve: () => void, reject: (reason: string) => void) => void, reject: (reason: string) => void) => reject("Socket is not open"));
  }*/


  //Στο επόμενο βήμα, θα πρέπει να προσθέσουμε λειτουργικότητα στη συνάρτηση handleMessage, έτσι ώστε να εκτελεί διαφορετικές ενέργειες ανάλογα με το μήνυμα που λαμβάνει από τον server.
//(In the next step, we should add functionality to the handleMessage function so that it performs different actions depending on the message it receives from the server.)
//Αρχικά, θα πρέπει να προσθέσουμε μια μεταβλητή για να κρατάμε την τρέχουσα κατάσταση της επιβεβαίωσης.
//(First, we need to add a variable to hold the current state of the confirmation.)
//Ας την ονομάσουμε confirmStatus και αρχικοποιούμε την τιμή της σε null, γιατί δεν έχουμε ακόμα λάβει επιβεβαίωση από τον χρήστη.
//(Let's call it confirmStatus and initialize its value to null, because we haven't received a confirmation from the user yet.)
/*
export class ConfirmPathNotificationComponent {
  confirmStatus: boolean | null = null;
  // ...
}

//Στη συνέχεια, θα πρέπει να ενημερώσουμε τη συνάρτηση handleMessage για να αντιδράσει στα διάφορα μηνύματα που μπορεί να λάβει από τον server.
//(Next, we need to update the handleMessage function to react to the various messages it may receive from the server.)
export class ConfirmPathNotificationComponent {
  confirmStatus: boolean | null = null;
  // ...

  handleMessage(event: MessageEvent): void {
    const message = JSON.parse(event.data);

    if (message.type === 'confirm_path') {
      // Λαμβάνουμε ένα αίτημα για επιβεβαίωση διαδρομής από τον server // We receive a route confirmation request from the server
      this.confirmStatus = null; // επαναφέρουμε την κατάσταση της επιβεβαίωσης // reset the state of the confirmation

      // εμφανίζουμε το μήνυμα στον χρήστη και δημιουργούμε το κουμπί επιβεβαίωσης // display the message to the user and create the confirm button
      const dialogRef = this.dialog.open(ConfirmPathDialogComponent, {
        data: { message: message.data },
        disableClose: true,
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.sendAnswerPath(true);
        } else if (result === false) {
          this.sendAnswer
        }
      }
    }*/
  }
  }
