import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ValidationErrors, Validators, ReactiveFormsModule, FormGroup, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [CommonModule, MatToolbarModule, MatIconModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class AppComponent {
  title = 'reactive.form';

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      roadnumber: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]],
      rue: [''],
      postalcode: ['', [Validators.pattern('^[A-Z][0-9][A-Z][ ]?[0-9][A-Z][0-9]$')]],
      comments: ['', [this.minWords(10)]]
    }, { validators: this.nameNotInComment });
  }

  minWords(minCount: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const wordCount = control.value.split(' ').filter((word: string) => word.trim().length > 0).length;
      return wordCount >= minCount ? null : { minWords: { requiredWords: minCount, actualWords: wordCount } };
   }
  }

  nameNotInComment(control: AbstractControl): ValidationErrors | null {
    const nameControl = control.get('name');
    const commentsControl = control.get('comments');

    // Si l'un des champs est vide, pas d'erreur
    if (!commentsControl?.value || !nameControl?.value) {
      return null;
    }

    const name = nameControl.value.toLowerCase();
    const comments = commentsControl.value.toLowerCase();

    // Si le nom est trouvé dans les commentaires, c'est invalide
    if (comments.includes(name)) {
      return { nameInComment: true };
    }

    return null;
  }
}