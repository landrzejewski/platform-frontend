import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {SizeService} from './size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('wrapper')
  wrapper: ElementRef;

  private barsHeight = 58;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateSize();
  }

  constructor(private sizeService: SizeService) {
  }

  ngAfterViewInit() {
    this.updateSize();
  }

  private updateSize() {
    this.sizeService.sizeChanges.next({ width: this.wrapper.nativeElement.offsetWidth, height: this.wrapper.nativeElement.offsetHeight - this.barsHeight});
  }

}
