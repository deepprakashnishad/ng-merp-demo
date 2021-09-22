import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-firestorage-uploader',
  templateUrl: './firestorage-uploader.component.html',
  styleUrls: ['./firestorage-uploader.component.scss']
})
export class FirestorageUploaderComponent implements OnInit {

	@Input() file: File;
  @Input() path: string;
  @Input() displayUploadedFiles: boolean = false;
  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  @Output() imageUploaded: EventEmitter<string>=new EventEmitter();

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {
    // Reference to storage bucket
    const ref = this.storage.ref(this.path);

    // The main task
    this.task = this.storage.upload(this.path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.imageUploaded.emit(this.downloadURL);
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
