import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from './photo.model';
import { PhotoService } from './photo.service';
import { Album, AlbumService } from '../album';
import { Tag, TagService } from '../tag';

@Component({
  selector: 'page-photo-update',
  templateUrl: 'photo-update.html',
})
export class PhotoUpdatePage implements OnInit {
  photo: Photo;
  albums: Album[];
  tags: Tag[];
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  taken: string;
  uploaded: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    title: [null, [Validators.required]],
    description: [null, []],
    image: [null, [Validators.required]],
    imageContentType: [null, []],
    height: [null, []],
    width: [null, []],
    taken: [null, []],
    uploaded: [null, []],
    album: [null, []],
    tags: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,

    private elementRef: ElementRef,
    private camera: Camera,
    private albumService: AlbumService,
    private tagService: TagService,
    private photoService: PhotoService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    // Set the Camera options
    this.cameraOptions = {
      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: 1,
    };
  }

  ngOnInit() {
    this.albumService.query().subscribe(
      (data) => {
        this.albums = data.body;
      },
      (error) => this.onError(error)
    );
    this.tagService.query().subscribe(
      (data) => {
        this.tags = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.photo = response.data;
      this.isNew = this.photo.id === null || this.photo.id === undefined;
      this.updateForm(this.photo);
    });
  }

  updateForm(photo: Photo) {
    this.form.patchValue({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      image: photo.image,
      imageContentType: photo.imageContentType,
      height: photo.height,
      width: photo.width,
      taken: this.isNew ? new Date().toISOString() : photo.taken,
      uploaded: this.isNew ? new Date().toISOString() : photo.uploaded,
      album: photo.album,
      tags: photo.tags,
    });
  }

  save() {
    this.isSaving = true;
    const photo = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.photoService.update(photo));
    } else {
      this.subscribeToSaveResponse(this.photoService.create(photo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Photo>>) {
    result.subscribe(
      (res: HttpResponse<Photo>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Photo ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/photo');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  private createFromForm(): Photo {
    return {
      ...new Photo(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      description: this.form.get(['description']).value,
      image: this.form.get(['image']).value,
      imageContentType: this.form.get(['imageContentType']).value,
      height: this.form.get(['height']).value,
      width: this.form.get(['width']).value,
      taken: new Date(this.form.get(['taken']).value),
      uploaded: new Date(this.form.get(['uploaded']).value),
      album: this.form.get(['album']).value,
      tags: this.form.get(['tags']).value,
    };
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
    this.processWebImage(event, field);
  }

  getPicture(fieldName) {
    if (Camera.installed()) {
      this.camera.getPicture(this.cameraOptions).then(
        (data) => {
          this.photo[fieldName] = data;
          this.photo[fieldName + 'ContentType'] = 'image/jpeg';
          this.form.patchValue({ [fieldName]: data });
          this.form.patchValue({ [fieldName + 'ContentType']: 'image/jpeg' });
        },
        (err) => {
          alert('Unable to take photo');
        }
      );
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event, fieldName) {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      const imageType = event.target.files[0].type;
      imageData = imageData.substring(imageData.indexOf(',') + 1);

      this.form.patchValue({ [fieldName]: imageData });
      this.form.patchValue({ [fieldName + 'ContentType']: imageType });
      this.photo[fieldName] = imageData;
      this.photo[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.photo, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
  compareAlbum(first: Album, second: Album): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackAlbumById(index: number, item: Album) {
    return item.id;
  }
  compareTag(first: Tag, second: Tag): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackTagById(index: number, item: Tag) {
    return item.id;
  }
}
