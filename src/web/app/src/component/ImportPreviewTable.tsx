import { MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { DropDown } from "@manito/core-ui-components";
import { ColumnDefinition, ColumnSemantics } from "importer/TransactionImporter";

// export type ColumnSemantics 

type DataRowProps = {
    index: number,
    data: string[],
    header?: boolean,
};

function DataRow({index, data, header}: DataRowProps) {
    return (
        <TableRow
            key={index}
            component={header ? 'th' : 'tr'}
        >
            <TableCell>
                <Typography>#{index + 1}</Typography>
            </TableCell>
            { data.map((value) => (
                <TableCell
                    sx={{
                        fontWeight: header ? 'bold' : 'normal',
                        textTransform: header ? 'uppercase' : 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {value ? value : '-'}
                </TableCell>
            )) }
        </TableRow>
    );
}

type DataSemanticSelectorRowProps = {
    key: number,
    selectedColumnDefinitionIndices: number[],
    selectableColumnDefinitions: ColumnDefinition[],
    onColumnDefinitionsChange?: (defs: number[]) => void,
};

function DataSemanticSelectorRow({key, selectedColumnDefinitionIndices, selectableColumnDefinitions, onColumnDefinitionsChange}: DataSemanticSelectorRowProps) {
    const handleSelectionChange = (columnIndex: number, itemIndex: number) => {
        const newSelectedIndices = [...selectedColumnDefinitionIndices];
        newSelectedIndices[columnIndex] = itemIndex;
        onColumnDefinitionsChange?.(newSelectedIndices);
    }

    return (
        <TableRow key={key} component={'tr'}
            >
            <TableCell>
                <Typography></Typography>
            </TableCell>
            { selectedColumnDefinitionIndices.map((selectedIndex, columnIndex) => 
                <TableCell>
                    <DropDown
                        margin="none"
                        value={selectedIndex.toString()}
                        onChange={(newItemIndex) => handleSelectionChange(columnIndex, Number.parseInt(newItemIndex))}
                        fullWidth
                    >
                        { selectableColumnDefinitions.map((item, itemIndex) => (
                            <MenuItem key={itemIndex} value={itemIndex.toString()}>{item.name}</MenuItem>
                        ))}
                    </DropDown>
                </TableCell>
            ) }
        </TableRow>
    );
}

type Props = {
    rows: any[][],
    selectedColumnDefinitionIndices: number[],
    firstRowIsHeader?: boolean,
    selectableColumnDefinitions: ColumnDefinition[],
    onColumnDefinitionsChange?: (defs: number[]) => void,
};

export default function ImportPreviewTable({rows, firstRowIsHeader, selectedColumnDefinitionIndices, selectableColumnDefinitions, onColumnDefinitionsChange}: Props) {

    const headerRow = firstRowIsHeader ? rows[0] : undefined;
    const dataRows = firstRowIsHeader ? rows.slice(1) : rows;

    return (
        <>
            <TableContainer>
                <Table size="small">
                    <TableBody sx={{ '& tr:last-child td, & tr:last-child th': { border: 0 } }}>
                        { headerRow &&
                            <DataRow index={0} data={headerRow} header />
                        }
                        { (headerRow || dataRows.length > 0) &&
                            <DataSemanticSelectorRow
                                key={-1}
                                selectedColumnDefinitionIndices={selectedColumnDefinitionIndices}
                                selectableColumnDefinitions={selectableColumnDefinitions}
                                onColumnDefinitionsChange={onColumnDefinitionsChange}
                            />
                        }
                        { dataRows.map((row, idx) => 
                            <DataRow index={headerRow ? idx + 1 : idx} data={row} />)
                        }
                        { dataRows.length === 0 &&
                            <TableRow>
                                <TableCell colSpan={headerRow?.length ? headerRow.length + 1 : 1}>
                                    <Typography align="center">No file content to display</Typography>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}