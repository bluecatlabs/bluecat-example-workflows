/*
Copyright 2024 BlueCat Networks Inc.

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
import {
    DetailsGrid,
    LabelLine,
    Layer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableScrollWrapper,
    TableToolbar,
    TableToolbarDefault,
    TableToolbarSearch,
} from '@bluecateng/pelagos';
import { useFormField } from '@bluecateng/auto-forms';
import { doPost, resetForm } from '@bluecateng/limani';
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
    const { value: selectedRecord, setValue: setSelectedRecord } =
        useFormField('record');

    const [views, setViews] = useState([]);
    const [zones, setZones] = useState([]);
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);

    // filterText is used by the search bar on top of the table
    const [filterText, setFilterText] = useState('');

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
            doPost(
                '/manage_text_record/delete_text_record/views',
                payload,
            ).then((data) => {
                setViews(data.views.length === 0 ? [] : data.views);
            });
        } else {
            setSelectedView('');
            setViews([]);
        }
        setSelectedZone('');
    }, [selectedConfiguration]);

    useEffect(() => {
        if (selectedView && selectedConfiguration && !selectedZone) {
            setSelectedZone('');
            const viewID = views.find((value) => {
                return value.name === selectedView.name;
            }).id;
            const payload = new FormData();
            payload.append('view', viewID);

            doPost(
                '/manage_text_record/delete_text_record/zones',
                payload,
            ).then((data) => {
                setZones(data.zones.length === 0 ? [] : data.zones);
            });
        } else {
            setSelectedZone('');
            setZones([]);
        }
    }, [selectedView, selectedConfiguration]);

    useEffect(() => {
        if (selectedView && selectedConfiguration && selectedZone) {
            setSelectedRecord({});
            const zoneID = zones.find((value) => {
                return value.name === selectedZone.name;
            }).id;
            const payload = new FormData();
            payload.append('zone', zoneID);

            doPost('/manage_text_record/delete_text_record/records', payload)
                .then((data) => {
                    data.records.map(
                        (rec) =>
                            (rec.displayName = rec.name
                                ? rec.name
                                : 'Same as zone named text record'),
                    );
                    setRecords(data.records.length === 0 ? [] : data.records);
                })
                .finally(() => {
                    setFilterText('');
                });
        } else {
            setRecords([]);
        }
    }, [selectedZone]);

    useEffect(() => {
        if (filterText.length !== 0 && records.length !== 0) {
            setSelectedRecord({});
            setFilteredRecords(
                records.filter((rec) =>
                    rec.displayName.toLowerCase().includes(filterText),
                ),
            );
        } else {
            setFilteredRecords(
                records.filter((rec) =>
                    rec.displayName.toLowerCase().includes(filterText),
                ),
            );
        }
    }, [records, filterText]);

    useEffect(() => {
        setSelectedRecord({});
        //when the list of records is changed, record should be unselected
    }, [records]);

    const handleRecordClick = useCallback(
        (event) => {
            const row = event.target.closest('tr');
            setSelectedRecord(matchRecord(row.dataset.id));
        },
        [selectedRecord],
    );

    const matchRecord = (id) => {
        let match = {};
        records.forEach((rec) => {
            if (rec.id === parseInt(id)) {
                match = rec;
            }
        });
        return match;
    };

    return (
        <DetailsGrid className='DeleteTextRecordForm__body'>
            <FormComboBoxField
                id='configuration'
                name='configuration'
                className='DeleteTextRecordForm__configuration'
                label='Configuration'
                values={configurations}
                noMatchText='No matching configuration was found'
                placeholder='Start typing to search for a Configuration'
                required={true}
            />

            <FormComboBoxField
                id='view'
                name='view'
                className='DeleteTextRecordForm__view'
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
                className='DeleteTextRecordForm__zone'
                label='Zone'
                values={zones}
                disabled={!selectedView}
                noMatchText='No matching zone was found'
                placeholder='Start typing to search for a Zone'
                required={true}
            />
            <Layer className='DeleteTextRecordForm__recordTableLayer'>
                <LabelLine htmlFor='recordTable' text='Records' />
                <TableToolbar
                    name='recordTable'
                    id='recordTable'
                    className='DeleteTextRecordForm__recordTable'
                    label='List of text records'>
                    <TableToolbarDefault hidden={false}>
                        <TableToolbarSearch
                            placeholder='Filter by record name'
                            aria-label='Filter'
                            onChange={(value) => {
                                setFilterText(value);
                            }}
                        />
                    </TableToolbarDefault>
                    <TableScrollWrapper
                        className='DeleteTextRecordForm__tableWrapper'
                        tabIndex='-1'>
                        <Table
                            className='DeleteTextRecordForm__table'
                            stickyHeader
                            fixedLayout>
                            <TableHead label='testLabel'></TableHead>
                            <TableBody onClick={handleRecordClick}>
                                {Object.entries(filteredRecords).map(
                                    ([, value]) => {
                                        return (
                                            <TableRow
                                                key={value.name}
                                                data-id={value.id}
                                                selected={
                                                    value.id ===
                                                    selectedRecord?.id
                                                }>
                                                <TableCell>
                                                    {value.displayName}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    },
                                )}
                            </TableBody>
                        </Table>
                    </TableScrollWrapper>
                </TableToolbar>
            </Layer>
        </DetailsGrid>
    );
};
