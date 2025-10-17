
import React from 'react';
import CrudCsvButtons from '../components/controls/customcomponent/sectionGrid/components/CrudCsvButtons';
import EmployeeAddEditModal from '../components/controls/customcomponent/sectionGrid/components/EmployeeAddEditModal';
import PhoneButtons from '../components/controls/customcomponent/sectionGrid/components/PhoneButtons';
import SectionGrid from '../components/controls/customcomponent/sectionGrid/components/SectionGrid';
import { GridActionEvent } from '../components/controls/customcomponent/sectionGrid/utils/actions';
import { exportCsv } from '../components/controls/customcomponent/sectionGrid/utils/export';
import { employeeSectionSchema } from '../schemas/employee.schema';
import { employeeSectionRows } from '../mockData/employee.data';
import { phoneRows } from '../mockData/phone.data';
import { phoneSchema } from '../schemas/phone.schema';
import EmployeeAddModal from '../components/controls/customcomponent/sectionGrid/components/EmployeeAddModal';
import EmployeeEditModal from '../components/controls/customcomponent/sectionGrid/components/EmployeeEditModal';

const EmployeeDetailPage = () => {
    const handleAction = (e: GridActionEvent, ctx?: { schemaTitle?: string; rows?: any[]; columns?: any[] }) => {
        console.log('Action:', e);
        if (e.identifier === 'export:csv' && ctx?.rows && ctx?.columns) {
            exportCsv(ctx.rows, ctx.columns, ctx.schemaTitle ?? 'export');
        }
    };

    return (
        <div className="container">
            <div className="card p-3">
                <SectionGrid
                    title="Employees"
                    schema={employeeSectionSchema}
                    rows={employeeSectionRows}
                    defaultOpen={true}
                    onAction={(e) => handleAction(e, {
                        schemaTitle: employeeSectionSchema.title,
                        rows: employeeSectionRows, columns: employeeSectionSchema.columns
                    })}
                    topButtonsComponent={CrudCsvButtons}
                    useGridControls={true}
                >
                    {/* <EmployeeAddEditModal /> */}
                    <EmployeeAddModal modalType="Add" />
                    <EmployeeEditModal modalType="Edit" />
                </SectionGrid>

            </div>

            <div style={{ height: 20 }} />

            <div className="card p-3">
                <SectionGrid
                    title="Phone Numbers"
                    schema={phoneSchema}
                    rows={phoneRows}
                    onAction={(e) => handleAction(e, { schemaTitle: phoneSchema.title, rows: phoneRows, columns: phoneSchema.columns })}
                    topButtonsComponent={PhoneButtons}
                    useGridControls={false}
                />
            </div>
        </div>
    );
}


export default EmployeeDetailPage