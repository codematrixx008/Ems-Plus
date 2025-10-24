import React, { useEffect, useState } from 'react'

type FormColumn = {
    Id: number
    ColumnName: string
    DbDataType: string
    ComponentType: string
    IsRequired: boolean
    Length: number
    Placeholder: string
    DropdownId: number
    IsHidden: boolean
    IsEnabled: boolean
    IsForSectionGrid: boolean
    IsForSearch: boolean
    IsEditablePopup: boolean
    TabIds: number[] | null
    AllowMultiSelectSearch: boolean
}

type DynamicFormProps = {
    formColumnsArray: FormColumn[]
    useFormControls?: boolean
    actionType?: string | null
    onActionHandled?: () => void
    getDropdownOptions?: Record<number, { label: string; value: string }[]> 
}

const DynamicForm = ({ formColumnsArray, getDropdownOptions = {}, useFormControls, actionType, onActionHandled }: DynamicFormProps) => {
    // 🔹 Initialize Form
    const initialFormState = formColumnsArray.reduce((acc, col) => {
        acc[col.ColumnName] = col.ComponentType === 'Checkbox' ? false : ''
        return acc
    }, {} as Record<string, any>)

    const [formData, setFormData] = useState<Record<string, any>>(initialFormState)

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        console.log('✅ Form Submitted:', formData)
    }

    const handleCancel = () => {
        console.log('❌ Form Reset')
        setFormData(initialFormState)
    }

    // 🔹 External Save / Cancel Actions
    useEffect(() => {
        if (!actionType) return
        if (actionType === 'save') handleSubmit()
        else if (actionType === 'cancel') handleCancel()
        onActionHandled?.()
    }, [actionType])

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {formColumnsArray.map(col => {
                switch (col.ComponentType) {
                    case 'Textbox':
                        return (
                            <BsInputControl
                                key={col.Id}
                                id={col.ColumnName}
                                label={col.ColumnName}
                                placeholder={col.Placeholder}
                                value={formData[col.ColumnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(col.ColumnName, e.target.value)}
                            />
                        )

                    case 'CurrencyTextbox':
                        return (
                            <BsNumberInputControl
                                key={col.Id}
                                id={col.ColumnName}
                                label={col.ColumnName}
                                placeholder={col.Placeholder}
                                min={0}
                                step={1}
                                required={col.IsRequired}
                                value={formData[col.ColumnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(col.ColumnName, e.target.value)}
                            />
                        )

                    case 'DatePicker':
                        return (
                            <BsDateInputControl
                                key={col.Id}
                                id={col.ColumnName}
                                label={col.ColumnName}
                                placeholder={col.Placeholder}
                                required={col.IsRequired}
                                value={formData[col.ColumnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(col.ColumnName, e.target.value)}
                            />
                        )

                    case 'Dropdown':
                        return (
                            <BsSelectControl
                                key={col.Id}
                                id={col.ColumnName}
                                label={col.ColumnName}
                                options={[
                                    { label: `Please select ${col.ColumnName}`, value: '' },
                                    ...(getDropdownOptions[col.DropdownId] || [])
                                ]}
                               
                                required={col.IsRequired}
                                value={formData[col.ColumnName]}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    handleChange(col.ColumnName, e.target.value)
                                }
                            />
                        )

                    case 'Checkbox':
                        return (
                            <BsCheckboxControl
                                key={col.Id}
                                id={col.ColumnName}
                                checked={formData[col.ColumnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(col.ColumnName, e.target.checked)}
                            >
                                {col.ColumnName}
                            </BsCheckboxControl>
                        )

                    default:
                        return null
                }
            })}

            {useFormControls && (
                <div className="pt-4 flex justify-end gap-3">
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            )}
        </form>
    )
}

export default DynamicForm
