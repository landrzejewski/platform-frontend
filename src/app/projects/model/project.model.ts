import {ProjectFileModel} from './project-file.model';
import {CommandModel} from './command.model';

export class ProjectModel {

  id: number;
  name: string;
  description: string;
  language: string;
  files: ProjectFileModel[];
  availableCommands: CommandModel[];

}
