import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    Stack,
    MenuItem,
    Typography,
    Alert,
} from '@mui/material';
import { Checkbox, DropDown, FileUploadButton } from '@manito/core-ui-components';

import Transaction from 'entity/Transaction';
import { CsvTransactionImporter, ColumnDefinition, ColumnSemantics, Options as ImporterOptions } from 'importer/TransactionImporter';
import { selectAllCategories, useCategoryStore } from 'stores/category';
import { parseCsv, Options as CsvOptions } from 'util/CsvReader';
import { selectAllWallets, useWalletStore } from 'stores/wallet';
import ImportPreviewTable from 'component/ImportPreviewTable';
import ConfirmDialog from 'component/ConfirmDialog';


type Props = {
    open: boolean,

    onSubmit?: (value: Transaction[]) => void,
    onClose?: () => void,
};

const SAMPLE_ROW_LIMIT = 10;
    
export default function ImportTransactionDialog({open, onSubmit, onClose}: Props) {
    const categories = useCategoryStore(selectAllCategories);
    const allWallets = useWalletStore(selectAllWallets);

    const [fileContent, setFileContent] = useState<string | undefined>(undefined);
    const [csvHasHeader, setCsvHasHeader] = useState(true);
    const [csvDelimiter, setCsvDelimiter] = useState(';');
    const [isCloseConfirmDialogOpen, setIsCloseConfirmDialogOpen] = useState(false);
    const [error, setError] = useState('');
    const [selectedColumnDefinitionIndices, setSelectedColumnDefinitionIndices] = useState<number[]>([]);
    const [sampleRows, setSampleRows] = useState<string[][]>([]);

    const SELECTABE_COLUMN_DEFS: ColumnDefinition[] = [
        { name: '-', semantics: ColumnSemantics.IGNORE },
        { name: 'Time', semantics: ColumnSemantics.TIME },
        { name: 'Notes', semantics: ColumnSemantics.NOTES },
        { name: 'Category', semantics: ColumnSemantics.CATEGORY },
        ...allWallets.map(wallet => ({
            name: `Wallet: ${wallet.name}`,
            semantics: ColumnSemantics.WALLET,
            walletId: wallet.id,
        })),
    ]

    const reset = () => {
        setFileContent(undefined);
        setError('');
        setIsCloseConfirmDialogOpen(false);
    }

    const parseSampleRows = (fileContent: string) => {
        const csvOptions: CsvOptions = {
            delimiter: csvDelimiter,
            hasHeader: csvHasHeader,
            rowLimit: SAMPLE_ROW_LIMIT,
        };
        const parsedRows = parseCsv(fileContent, csvOptions)
        setSampleRows(parsedRows);

        setSelectedColumnDefinitionIndices((currentIndices) => {
            const numColumnsOld = currentIndices.length;
            const numColumnsNew = parsedRows[0].length;
            if(numColumnsNew > numColumnsOld) {
                return [ ...currentIndices, ...Array(numColumnsNew - numColumnsOld).fill(0)];
            } else {
                return currentIndices.slice(0, numColumnsNew);
            }
        })
    }
    
    const handleFileUploaded = (fileContent: string) => {
        setFileContent(fileContent);
        parseSampleRows(fileContent);
        setError('')
    }

    const handleColumnDefinitionsChanged = (newIndices: number[]) => {
        setSelectedColumnDefinitionIndices(newIndices);
        setError('')
    }

    const handleSubmit = () => {
        try {
            const importerOptions: ImporterOptions = {
                hasHeader: csvHasHeader,
                delimiter: csvDelimiter,
            };

            const columnDefinitions = selectedColumnDefinitionIndices.map((index) => SELECTABE_COLUMN_DEFS[index])

            const importer = new CsvTransactionImporter(columnDefinitions, categories, importerOptions);
            const transactions = importer.loadFromString(fileContent!);
    
            onSubmit?.(transactions);
            reset();
        } catch(error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            setError(`Failed to parse the file: ${errorMessage}`);
        }
    }

    const handleCancel = () => {
        onClose?.();
        reset();
    }

    const handleDialogClose = () => {
        if(sampleRows.length === 0) {
            handleCancel();
            return;
        }

        setIsCloseConfirmDialogOpen(true);
    }

    const isLoaded = fileContent !== undefined;
    
    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            maxWidth={false}
        >
            <DialogTitle>Import transactions</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <Stack
                        direction="column"
                        gap={1}
                        minWidth={isLoaded ? 500 : undefined}
                        maxWidth={!isLoaded ? 250 : undefined}
                    >
                        { !isLoaded &&
                            <>
                                <Typography align="center">This feature allows you to load transactions from a CSV file.</Typography>
                                <FileUploadButton
                                    text="Upload File..."
                                    acceptContentTypes={["text/*"]}
                                    maxFileSize={1*1024*1024}
                                    onUpload={handleFileUploaded}
                                    onError={setError}
                                />
                            </>
                        }
                        { isLoaded &&
                            <>
                                <Stack
                                    direction="row"
                                    gap={1}
                                    display="flex"
                                    justifyContent="space-evenly"
                                >
                                    <DropDown
                                        label="Delimiter"
                                        required
                                        value={csvDelimiter}
                                        onChange={setCsvDelimiter}
                                    >
                                        <MenuItem value=",">
                                            <Typography>Comma (,)</Typography>
                                        </MenuItem>
                                        <MenuItem value=";">
                                            <Typography>Semicolon (;)</Typography>
                                        </MenuItem>
                                    </DropDown>
                                    <Checkbox
                                        label="First row is a header"
                                        checked={csvHasHeader}
                                        onChange={setCsvHasHeader}
                                    />
                                </Stack>
                                <Typography>Preview:</Typography>
                                <ImportPreviewTable
                                    rows={sampleRows}
                                    firstRowIsHeader={csvHasHeader}
                                    selectableColumnDefinitions={SELECTABE_COLUMN_DEFS}
                                    selectedColumnDefinitionIndices={selectedColumnDefinitionIndices}
                                    onColumnDefinitionsChange={handleColumnDefinitionsChanged}
                                />
                            </>
                        }
                        { error &&
                            <Alert severity="error" onClose={() => setError('')}>
                                Error: {error}
                            </Alert>
                        }
                        <Stack direction="row" sx={{display: "inline-flex", justifyContent: "flex-end"}}>
                            <Button
                                variant="text"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            { isLoaded &&
                                <Button
                                    variant="contained"
                                    disabled={!sampleRows || sampleRows.length <= 0}
                                    onClick={handleSubmit}
                                >
                                    Import
                                </Button>
                            }
                        </Stack>
                    </Stack>
                </FormControl>
            </DialogContent>
            <ConfirmDialog
                open={isCloseConfirmDialogOpen}
                title="Cancel import?"
                message="Are you sure you want to cancel the import? Any changes you made will be lost and the file will be unloaded."
                onClose={() => setIsCloseConfirmDialogOpen(false)}
                onConfirm={handleCancel}
            />
        </Dialog>
    );
}
