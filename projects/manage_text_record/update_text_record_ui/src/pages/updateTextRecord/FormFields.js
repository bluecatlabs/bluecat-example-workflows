/*
Copyright 2023 BlueCat Networks Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { useCallback, useEffect, useState } from 'react';
import { Button,
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
        TableScrollWrapper,
        TableToolbar,
        TableToolbarDefault
        } from "@bluecateng/pelagos";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FormTextInput } from '@bluecateng/pelagos-forms';
import { useFormField } from '@bluecateng/auto-forms';
import { doPost, resetForm } from '@bluecat/limani';
import FormComboBoxField from '../../components/FormComboBoxField';

export const FormFields = ({ initialFormData }) => {
    resetForm(initialFormData);

    const { value: configurations } = useFormField('configurations');
    const {
        value: selectedConfiguration,
        setError: setSelectedConfigurationError,
        error: selectedConfigurationError,
    } = useFormField('configuration');
    const {
        value: selectedView,
        setValue: setSelectedView,
        error: selectedViewError,
        setError: setSelectedViewError,
    } = useFormField('view');
    const {
        value: selectedZone,
        setValue: setSelectedZone,
        error: selectedZoneError,
        setError: setSelectedZoneError,
    } = useFormField('zone');

    const placeholder = () => ('agga');

    const [views, setViews] = useState([]);
    const [zones, setZones] = useState([]);

    const checkAllFieldsHasValue = useCallback(() => {
        return !(selectedConfiguration && selectedView && selectedZone);
    }, [selectedZone, selectedConfiguration, selectedView]);

    // This is to remove the errors set from extraValidation on the form when the submit button is pressed
    useEffect(() => {
        if (selectedConfiguration && selectedConfigurationError) {
            setSelectedConfigurationError(null);
        }
        if (selectedView && selectedViewError) {
            setSelectedViewError(null);
        }
        if (selectedZone && selectedZoneError) {
            setSelectedZoneError(null);
        }
    }, [selectedConfiguration, selectedView, selectedZone]);

    useEffect(() => {
        if (selectedConfiguration) {
            setSelectedView('');
            const configurationID =
                configurations.find((value) => {
                    return value.name === selectedConfiguration.name;
                })?.id ?? '';
            const payload = new FormData();
            payload.append('configuration', configurationID);
            doPost('/add_text_record/views', payload).then((data) => {
                setViews(data.views.length === 0 ? [] : data.views);
            });
        } else {
            setSelectedView('');
            setSelectedZone('');
            setViews([]);
        }
    }, [selectedConfiguration]);

    useEffect(() => {
        if (selectedView && selectedConfiguration) {
            setSelectedZone('');
            const viewID = views.find((value) => {
                return value.name === selectedView.name;
            }).id;
            const payload = new FormData();
            payload.append('view', viewID);

            doPost('/add_text_record/zones', payload).then((data) => {
                setZones(data.zones.length === 0 ? [] : data.zones);
            });
        } else {
            setZones([]);
        }
    }, [selectedView, selectedConfiguration]);


        // Columns in the list for text entries
    const columns = [
        {
            id: 'text',
            header: 'text',
            width: 100,
        }
    ];

    return (
        <div className='UpdateTextRecordForm__fields FormFields--standardPadding'>
            <FormComboBoxField
                id='configuration'
                name='configuration'
                label='Configuration'
                values={configurations}
                noMatchText='No matching configuration was found'
                placeholder='Start typing to search for a Configuration'
                required={true}
            />

            <FormComboBoxField
                id='view'
                name='view'
                label='View'
                values={views}
                disabled={!selectedConfiguration}
                noMatchText='No matching view was found'
                placeholder='Start typing to search for a View'
                required={true}
            />

            <FormComboBoxField
                id='zone'
                name='zone'
                label='Zone'
                values={zones}
                disabled={!selectedView}
                noMatchText='No matching zone was found'
                placeholder='Start typing to search for a Zone'
                required={true}
            />


            <FormTextInput label='Text record' name='recordSearch' disabled={checkAllFieldsHasValue()} />

            <Button
                id='searchButton'
                text="Search"
                onClick={
                    placeholder
                    //TODO: implement search
            }
            />

            <FormTextInput label='Filter' name='filter' disabled={checkAllFieldsHasValue()} />

            // <FormTextInput label='Text' name='oldText' disabled={checkAllFieldsHasValue()} />

            <TableToolbar className='test_record_table'>
                <TableScrollWrapper className='Workflows__tableWrapper' tabIndex='-1'>
                    <Table className='Workflows__table' stickyHeader fixedLayout>
                        <TableHead>
                            <TableRow>
                                {columns.map(({ text }) => (
                                    <TableHeader
                                        key={text}
                                        sortable={false}
                                        style={{ width: `${width}%` }}>
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(data.workflows).map(([, value], text) => {
                                return (
                                    <TableRow key={text} data-id={text}>
                                        <TableCell>{value.text}</TableCell>
                                        <TableCell>
                                            <IconMenu
                                                id={'Thing'}
                                                icon={faEllipsisV}
                                                flipped={true}>
                                                <IconMenuItem
                                                    text='Delete'
                                                    onClick={() => deleteWorkflow(value.name)}
                                                />
                                            </IconMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableScrollWrapper>
            </TableToolbar>




            <FormTextInput label='Name' name='oldName' disabled={checkAllFieldsHasValue()} />

            <FormTextInput label='New text' name='newText' disabled={checkAllFieldsHasValue()} />
        </div>
    );
};
