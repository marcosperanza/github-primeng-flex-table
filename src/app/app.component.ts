import {
  Component,
  VERSION,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import {DatePipe} from '@angular/common';

export interface Color {
  b?: number;
  g?: number;
  r?: number;
  
}

export interface Annotation {
  color?: Color;
  colorRuleId?: string;
  severity?: 'ERROR' | 'WARN' | 'INFO' | 'NONE';
  text?: string;
  type?: 'SYSTEM' | 'USER' | 'SCRIPT' | 'DESIGN' | 'SEARCH';
}

export interface OutputRecord {
  annotations?: Array<Annotation>;
  columnType?: Array<'TIME' | 'STRING'>;
  id?: number;
  pinnedStatus?: 'FULL' | 'PARTIALLY' | 'NONE';
  pinnedSubRow?: Array<number>;
  selected?: boolean;
  showDetails?: boolean;
  values?: Array<string>;
}

export interface Dialogue {
  fields?: Array<DialogueField>;
  rowIdRef?: number;
  separator?: string;
}
export interface DialogueField {
  fieldName?: string;
  separator?: string;
  value?: string;
}
export interface ColumnModel {
  colorable?: boolean;
  columnType?:
    | 'AbsoluteTimeType'
    | 'BitSequenceType'
    | 'BitmaskType'
    | 'BooleanType'
    | 'BytePatternType'
    | 'ByteSequenceType'
    | 'CharSequenceType'
    | 'DigitSequenceType'
    | 'EnumeratedType'
    | 'FixedPointType'
    | 'FloatingPointType'
    | 'Instance'
    | 'IPv4Type'
    | 'IPv6Type'
    | 'MtpType'
    | 'NumericType'
    | 'OctetType'
    | 'PcapType'
    | 'RelativeTimeType'
    | 'Root'
    | 'SummaryType'
    | 'GENERIC';
  fieldIndex?: number;
  fieldType?:
    | 'AbsoluteTimeType'
    | 'BitSequenceType'
    | 'BitmaskType'
    | 'BooleanType'
    | 'BytePatternType'
    | 'ByteSequenceType'
    | 'CharSequenceType'
    | 'DigitSequenceType'
    | 'EnumeratedType'
    | 'FixedPointType'
    | 'FloatingPointType'
    | 'Instance'
    | 'IPv4Type'
    | 'IPv6Type'
    | 'MtpType'
    | 'NumericType'
    | 'OctetType'
    | 'PcapType'
    | 'RelativeTimeType'
    | 'Root'
    | 'SummaryType'
    | 'GENERIC';
  identifier?: string;
  name?: string;
  order?: 'ASC' | 'DESC' | 'NONE';
  schemaId?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  visible = of(true);
  expandedRows = new Map<string, boolean>();
  pageSize: 100;
  totalRecords: number;
  selectedRows: number[] = [];
  expandedDialogue: { [key: number]: Dialogue[]} = {};


  loading = true;
  densityTable: 'LOW' | 'NORMAL' | 'HIGH' = 'LOW';
  isTrace: false;

  records: OutputRecord[];
  tableColumnModel: ColumnModel[];
  dataColumnModel: ColumnModel[];


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getColumnModel();
  }

  getColumnModel() {
    this.http
      .get<ColumnModel[]>('assets/data/records-column-model.json')
      .subscribe(value => {
        this.tableColumnModel = value;
      });
  }

  getOutputRecords(offset: number, lenght: number) {
    this.http
      .get<any>('assets/data/records-small.json')
      .pipe(map(value => value.records))

      .subscribe(value => {
        this.records = value.slice(offset, lenght);
        this.totalRecords = this.records.length;
        this.loading = false;
      });
  }

  getDialogues(id: number) {
    if (id % 2 === 0) {
      return this.http.get<any>('assets/data/dialogues-small.json');
    }
    return this.http.get<any>('assets/data/dialogues-2-small.json');
  }

  getDensityStyle(densityTable: 'LOW' | 'NORMAL' | 'HIGH') {
    switch (densityTable) {
      case 'HIGH':
        return 'p-datatable-sm';
      case 'LOW':
        return 'p-datatable-lg';
      default:
        return '';
    }
  }

  paginate($event: any) {
    this.loading = true;
    this.pageSize = $event.rows;
    this.getOutputRecords($event.first, $event.rows);
    //this.resultPageActionsApi.fetchResult(this.requestId, $event.rows, $event.first);
  }

  isColumnToShow(id: string): boolean {
    return true;  
  }

  isRowSelected(id: number): boolean {
    return this.getSelectedRowIndex(id) > -1;
  }

  getSelectedRowIndex(id: number): number {
    return this.selectedRows?.indexOf(id);
  }

  onRowSelected(identifier: number) {
    console.log('onRowSelected ' + identifier);
  }
  onRowExpanded(outputRecord: OutputRecord) {
    //this.resultPageActionsApi.getDialogue(this.requestId, this.queryConfiguration?.templateUuid.uuid, outputRecord.id);
  }
   isDialogueSelected(dialogueIndex: number, outputRecordId: number): boolean {
    return false;
  }
   onDialogueSelected(dialogueIndex: number, outputRecordId: number) {
  
  }
  
  getValueForTable(col: ColumnModel, rowData: any, i: number) {
    if (col.fieldType === 'AbsoluteTimeType') {
      const datePipe: DatePipe = new DatePipe('en');
      return datePipe.transform(rowData.values[i], 'dd-MM-yyyy HH.mm.ss:SSS');
    } else if (col.fieldType === 'RelativeTimeType') {
      return rowData.values[i];
    } else {
      return rowData.values[i];
    }
  }
  onClose() {
    console.log('on Close');
  }
}
