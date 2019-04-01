import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SizeService {

  sizeChanges = new BehaviorSubject<{}>({width: window.innerWidth, height: window.innerHeight});

}
