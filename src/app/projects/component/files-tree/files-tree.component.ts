import {Component, Input} from '@angular/core';
import {ProjectsService} from '../../service/projects.service';

@Component({
  selector: 'app-files-tree',
  templateUrl: './files-tree.component.html',
  styleUrls: ['./files-tree.component.css']
})
export class FilesTreeComponent {

  @Input()
  items: Object[];
  @Input()
  key: string;

  constructor(public projectsService: ProjectsService) {
  }

  onSelect(item) {
    if (!item.isDirectory) {
      this.projectsService.fileChanges.next(item.name);
    }
  }

}
