import {CategoryResultModel} from "./category-result.model";

export class TestResultModel {
    passed: boolean;
    requiredScorePercentage: number;
    timeInSeconds: number;
    numberOfQuestions: number;
    numberOfCorrectQuestions: number;
    categoryResults: CategoryResultModel[];
}