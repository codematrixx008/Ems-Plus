import React, { useMemo } from 'react';
import CrudCsvButtons from '../components/controls/customcomponent/sectionGrid/components/CrudCsvButtons';
import EmployeeAddModal from '../components/controls/customcomponent/sectionGrid/components/EmployeeAddModal';
import EmployeeEditModal from '../components/controls/customcomponent/sectionGrid/components/EmployeeEditModal';
import PhoneButtons from '../components/controls/customcomponent/sectionGrid/components/PhoneButtons';
import SectionGrid3 from '../components/controls/customcomponent/grid3/section/SectionGrid3';
import { exportCsv } from '../components/controls/customcomponent/sectionGrid/utils/export';
import { employeeSectionSchema } from '../schemas/employee.schema';
import { employeeSectionRows } from '../mockData/employee.data';
import { phoneRows } from '../mockData/phone.data';
import { phoneSchema } from '../schemas/phone.schema';
import EmployeeEditModal3 from '../components/controls/customcomponent/grid3/section/Modal/EmployeeEditModal3';
import EmployeeAddModal3 from '../components/controls/customcomponent/grid3/section/Modal/EmployeeAddModal3';
import { employeeProvider } from '../components/controls/customcomponent/grid3/section/providers/employeeProvider';

const EmployeeDetailPage3: React.FC = () => {
    console.log('✅ EmployeeDetailPage3 component rendering started');

    // ----- Handle Actions -----
    const handleAction = (id: string, ctx?: { schemaTitle?: string; rows?: any[]; columns?: any[] }) => {
        console.log('🟢 handleAction called with:', { id, ctx });

        if (id === 'export:csv' && ctx?.rows && ctx?.columns) {
            console.log('📦 Exporting CSV for:', ctx.schemaTitle);
            exportCsv(ctx.rows, ctx.columns, ctx.schemaTitle ?? 'export');
            console.log('✅ CSV export completed');
        } else {
            console.log('⚠️ Unhandled action:', id);
        }
    };

    // ----- Option Providers -----
    console.log('🔧 Initializing optionProviders using useMemo');
    const optionProviders = useMemo(() => {
        console.log('🧩 useMemo executed for optionProviders');
        return { Employee: employeeProvider };
    }, []);
    console.log('✅ optionProviders initialized:', optionProviders);

    console.log('🚀 Rendering EmployeeDetailPage3 UI');
    return (
        <div className="container">
            {/* Employees Section */}
            <div className="card p-3">
                <SectionGrid3
                    title="Employees"
                    schema={employeeSectionSchema.columns as any}
                    rows={employeeSectionRows}
                    defaultOpen={true}
                    onAction={(id, payload) => {
                        console.log('📣 Employees SectionGrid3 onAction triggered:', { id, payload });
                        handleAction(id, {
                            schemaTitle: employeeSectionSchema.title,
                            rows: employeeSectionRows,
                            columns: employeeSectionSchema.columns,
                        });
                        alert(`Employees action: ${id}, payload=${JSON.stringify(payload)}`);
                    }}
                    topButtonsComponent={CrudCsvButtons}
                    useGridControls={true}
                    optionProviders={optionProviders}
                >
                    <EmployeeAddModal3 modalType="Add" />
                    <EmployeeEditModal3 modalType="Edit" />
                </SectionGrid3>
            </div>

            <div style={{ height: 20 }} />

            {/* Phone Numbers Section */}
            <div className="card p-3">
                <SectionGrid3
                    title="Phone Numbers"
                    schema={phoneSchema.columns as any}
                    rows={phoneRows}
                    defaultOpen={false}
                    onAction={(id, payload) => {
                        console.log('📣 Phone SectionGrid3 onAction triggered:', { id, payload });
                        handleAction(id, {
                            schemaTitle: phoneSchema.title,
                            rows: phoneRows,
                            columns: phoneSchema.columns,
                        });
                        alert(`Phone Numbers action: ${id}, payload=${JSON.stringify(payload)}`);
                    }}
                    topButtonsComponent={PhoneButtons}
                    useGridControls={false}
                    optionProviders={optionProviders}
                />
            </div>
        </div>
    );
};

export default EmployeeDetailPage3;
