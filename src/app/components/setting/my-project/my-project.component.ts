import { COLUMN_STT } from 'src/app/base/constant';
import { TYPE_PROJECT } from './../../../base/constant';
import { CurrencyPipe, formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from "@angular/core";
import { ColDef } from 'ag-grid-community';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';
import { environment } from 'src/environments/environment';
import { MyProjectActionComponent } from './action/action.component';
import { Utils } from 'src/app/base/utils';
import { Router } from '@angular/router';

@Component({
    selector: 'app-my-project',
    templateUrl: './my-project.component.html',
    styleUrls: ['./my-project.component.css']
})
export class MyProjectComponent implements OnInit {

    public columnDefs: ColDef[];
    public data$: Observable<Project[]>;
    public title: string = 'LỊCH SỬ ĐĂNG BÀI';
    public onlyView: boolean = false;

    constructor(
        public activedModal: NgbActiveModal,
        private projectService: ProjectService,
        private currencyPipe: CurrencyPipe,
        private router: Router
    ) {}

    public ngOnInit(): void {
        this.ngOnInitColumn();
        if (!this.data$) {
            this.loadDataProject();
        }
    }

    public loadDataProject(): void {
        this.data$ = this.projectService.findMyProject();
    }

    private ngOnInitColumn(): void {
        this.columnDefs = [
            COLUMN_STT,
            {
                headerName: 'HÌNH ẢNH',
                headerTooltip: 'HÌNH ẢNH',
                minWidth: 150,
                maxWidth: 150,
                cellStyle: {
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'cursor': 'pointer'
                },
                cellRenderer: (params: any) => {
                    return `<img src="${environment.IMAGE_STORE_URL}${params.data.avatar}" class="w-100 h-100" />`
                },
                onCellClicked: param => {
                    this.navigate(param.data);
                    this.activedModal.close();
                }
            },
            {
                headerName: 'TIÊU ĐỀ',
                headerTooltip: 'TIÊU ĐỀ',
                minWidth: 120,
                field: 'title',
                tooltipField: 'title',
                cellStyle: {
                    'top': '30px',
                    'color': '#007bff',
                    'cursor': 'pointer'
                },
                onCellClicked: param => {
                    this.navigate(param.data);
                    this.activedModal.close();
                }
            },
            {
                headerName: 'LOẠI DỰ ÁN',
                headerTooltip: 'LOẠI DỰ ÁN',
                minWidth: 120,
                valueGetter: ({data}) => {
                    return TYPE_PROJECT[data.type].name;
                },
                cellStyle: {
                    'top': '30px'
                }
            },
            {
                headerName: 'THỜI GIAN',
                headerTooltip: 'THỜI GIAN',
                minWidth: 200,
                maxWidth: 200,

                valueGetter: ({data}) => {
                    const startDate = formatDate(new Date(data.startDate), 'dd/MM/yyyy', 'en-US')
                    const endDate = data.endDate ? formatDate(new Date(data.endDate), 'dd/MM/yyyy', 'en-US') : '~'
                    return `${startDate} - ${endDate}`
                },
                cellStyle: {
                    'top': '30px'
                }
            },
            {
                headerName: 'TRẠNG THÁI',
                headerTooltip: 'TRẠNG THÁI',

                minWidth: 150,
                maxWidth: 150,

                field: 'statusName',
                tooltipField: 'statusName',
                cellStyle: ({data}) => {
                    return {
                        'top': '30px',
                        'color': data.status == 0 ? '#5ad1e8' : data.status == 1 ? '#65df87' : '#e85757'
                    }
                }
            },
            {
                headerName: 'TỔNG TIỀN',
                headerTooltip: 'TỔNG TIỀN',
                minWidth: 120,
                
                valueGetter: ({data}) => {
                    return this.currencyPipe.transform(data.total || 0, 'VND');
                },
                cellStyle: {
                    'top': '30px'
                }
            },
            {
                headerName: 'NGÀY SỬA',
                headerTooltip: 'NGÀY SỬA',
                minWidth: 120,
                
                valueGetter: ({data}) => {
                    if (!data.modifiedDate) return null;
                    return formatDate(new Date(data.modifiedDate), 'dd/MM/yyyy', 'en-US')
                },
                cellStyle: {
                    'top': '30px'
                }
            },
            {
                headerName: 'NGƯỜI SỬA',
                headerTooltip: 'NGƯỜI SỬA',
                minWidth: 120,
                
                field: 'modifier',
                tooltipField: 'modifier',
                cellStyle: {
                    'top': '30px'
                }
            },
        ];

        if (!this.onlyView) {
            this.columnDefs.push({
                headerName: 'THAO TÁC',
                headerTooltip: 'THAO TÁC',
                minWidth: 110,
                maxWidth: 110,
                cellStyle: {
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center'
                },
                cellRenderer: MyProjectActionComponent
            });
        }
    }

    public navigate(project: Project): void {
        const title = Utils.toLowerCaseNonAccentVietnamese(project.title).replace(/\s/g, '-');
        this.router.navigate(['/project',title], {
            queryParams: {
                id: project.id
            }
        });
    }
}