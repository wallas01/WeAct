import {
  Component,
  Input,
  NgModule,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'display-component',
  template: `
    <div id="output">
      <voter-component
        [question]="question"
        [yesAnswer]="yesAnswer"
        [noAnswer]="noAnswer"
        (output)="emitVote($event)"
      ></voter-component>
      <div id="lastVote">
        {{ voteFromVoter ? yesAnswer : noAnswer }}
      </div>
    </div>
  `,
})
export class DisplayComponent {
  public question = 'Too easy????';
  public yesAnswer = 'Yes';
  public noAnswer = 'No';

  public voteFromVoter: boolean | null = null;

  emitVote(e: boolean) {
    if (e) this.voteFromVoter = e;
  }
}
@Component({
  selector: 'voter-component',
  template: `
    {{ question }}
    <button (click)="vote(true)">{{ yesAnswer }}</button>
    <button (click)="vote(false)">{{ noAnswer }}</button>
  `,
})
export class VoterComponent {
  @Input()
  public question!: string;

  @Input()
  public yesAnswer!: string;

  @Input()
  public noAnswer!: string;

  @Output()
  public output = new EventEmitter<boolean>();

  public vote(vote: boolean): void {
    this.output.emit(vote);
  }
}

@Component({
  template: `<display-component />`,
})
export class PreviewComponent {}

@NgModule({
  declarations: [PreviewComponent, DisplayComponent, VoterComponent],
})
export class PreviewModule {}
