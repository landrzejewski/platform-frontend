import {AnswerInstanceModel} from "./answer-instance.model";

export class QuestionInstanceModel {

  id: number;
  index:number;
  category: string;
  text: string;
  value: string;
  questionType: string;
  answers: AnswerInstanceModel[];

}
