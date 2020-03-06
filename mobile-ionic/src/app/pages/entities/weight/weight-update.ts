import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Weight } from './weight.model';
import { WeightService } from './weight.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'page-weight-update',
    templateUrl: 'weight-update.html'
})
export class WeightUpdatePage implements OnInit {

    weight: Weight;
    users: User[];
    timestamp: string;
    isSaving = false;
    isNew = true;
    isReadyToSave: boolean;

    form = this.formBuilder.group({
        id: [],
        timestamp: [null, [Validators.required]],
        weight: [null, [Validators.required]],
        user: [null, []],
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        private userService: UserService,
        private weightService: WeightService
    ) {

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });

    }

    ngOnInit() {
        this.userService.findAll().subscribe(data => this.users = data, (error) => this.onError(error));
        this.activatedRoute.data.subscribe((response) => {
            this.updateForm(response.data);
            this.weight = response.data;
            this.isNew = this.weight.id === null || this.weight.id === undefined;
        });
    }

    updateForm(weight: Weight) {
        this.form.patchValue({
            id: weight.id,
            timestamp: (this.isNew) ? new Date().toISOString() : weight.timestamp,
            weight: weight.weight,
            user: weight.user,
        });
    }

    save() {
        this.isSaving = true;
        const weight = this.createFromForm();
        if (!this.isNew) {
            this.subscribeToSaveResponse(this.weightService.update(weight));
        } else {
            this.subscribeToSaveResponse(this.weightService.create(weight));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<Weight>>) {
        result.subscribe((res: HttpResponse<Weight>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (response.status === 201) {
          action = 'created';
        }
        this.isSaving = false;
        const toast = await this.toastCtrl.create({message: `Weight ${action} successfully.`, duration: 2000, position: 'middle'});
        toast.present();
        this.navController.navigateBack('/tabs/entities/weight');
    }

    previousState() {
        window.history.back();
    }

    async onError(error) {
        this.isSaving = false;
        console.error(error);
        const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
        toast.present();
    }

    private createFromForm(): Weight {
        return {
            ...new Weight(),
            id: this.form.get(['id']).value,
            timestamp: new Date(this.form.get(['timestamp']).value),
            weight: this.form.get(['weight']).value,
            user: this.form.get(['user']).value,
        };
    }

    compareUser(first: User, second: User): boolean {
        return first && second ? first.id === second.id : first === second;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}
