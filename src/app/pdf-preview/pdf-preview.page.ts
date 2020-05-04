import { Component, OnInit, Input } from '@angular/core';
import { SimpleService } from '../api/simple-service.service';
import { TranslationService } from '../api/translation.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.page.html',
  styleUrls: ['./pdf-preview.page.scss'],
})
export class PdfPreviewPage {
  pdfUrl: string;
  @Input() pdf: any;
  loading: boolean = false;
  numPages: number = 0;

  constructor(public modalController: ModalController, public service: SimpleService,
              public translationService: TranslationService, public loadingController: LoadingController) { }

  async ionViewWillEnter() {
      this.pdfUrl = this.pdf;
      await this.service.showLoader(this.translationService.translationsList.offline_tool.messages.please_wait);
  }

  dismissModel() {
    this.modalController.dismiss();
  }

  async textLayerRendered(e: any) {
    if (this.numPages !== 0 && e.pageNumber === this.numPages) {
      await this.service.hideLoader();
      this.loading = true;
    }
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.numPages = pdf.numPages;
  }
}
