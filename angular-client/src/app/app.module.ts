// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { InputsModule } from "@progress/kendo-angular-inputs";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ConversationalUIModule } from "@progress/kendo-angular-conversational-ui";
import { IndicatorsModule } from "@progress/kendo-angular-indicators";
import { WebcamModule } from 'ngx-webcam';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { IconsModule } from '@progress/kendo-angular-icons';
import { NavigationModule } from "@progress/kendo-angular-navigation";
import { MenusModule } from "@progress/kendo-angular-menu";
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogsModule } from '@progress/kendo-angular-dialog';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CameraComponent } from './camera/camera.component';
import { TextCompletionComponent } from './text-completion/text-completion.component';
import { ImageCompletionComponent } from './image-completion/image-completion.component';
import { SignupComponent } from './signup/signup.component';
import { AnalyzeComponent } from './analyze/analyze.component';
import { RecipesComponent } from './recipes/recipes.component';
import { GenerateRecipeComponent } from './generate-recipe/generate-recipe.component';
import { SubstituteRecipeComponent } from './substitute-recipe/substitute-recipe.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { SubstituteRecipeCardComponent } from './substitute-recipe-card/substitute-recipe-card.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { HeaderComponent } from './header/header.component';
import { CameraMobileComponent } from './camera-mobile/camera-mobile.component';
import { FooterComponent } from './footer/footer.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CameraComponent,
    TextCompletionComponent,
    ImageCompletionComponent,
    SignupComponent,
    AnalyzeComponent,
    RecipesComponent,
    GenerateRecipeComponent,
    SubstituteRecipeComponent,
    RecipeCardComponent,
    SubstituteRecipeCardComponent,
    UserSettingsComponent,
    HeaderComponent,
    CameraMobileComponent,
    FooterComponent,
    BottomNavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    WebcamModule,
    ConversationalUIModule,
    IndicatorsModule,
    UploadsModule,
    IconsModule,
    LayoutModule,
    NavigationModule,
    MenusModule,
    DropDownsModule,
    DialogsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
