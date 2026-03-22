import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import EnhancedTableHead from './table/EnhancedTableHead';
import EnhancedTableToolbar from './table/EnhancedTableToolbar';
import { getComparator } from './table/tableUtils';

function stringifyCellValue(value) {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function formatValueForInput(value, fieldType) {
  if (value === null || value === undefined) {
    return '';
  }

  if (fieldType === 'date') {
    return String(value).slice(0, 10);
  }

  if (fieldType === 'datetime-local') {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }

  return String(value);
}

function buildFormDataFromRow(row, fields) {
  return fields.reduce((accumulator, field) => {
    accumulator[field.name] = formatValueForInput(
      row?.[field.name],
      field.type,
    );
    return accumulator;
  }, {});
}

export default function EnhancedTable({
  title = 'Records',
  rows = [],
  columns = [],
  idField = 'id',
  addFields = [],
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
}) {
  const initialOrderBy = columns[0]?.id || idField;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(initialOrderBy);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [addFormData, setAddFormData] = React.useState({});
  const [addError, setAddError] = React.useState('');
  const [isSubmittingAdd, setIsSubmittingAdd] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState({});
  const [editError, setEditError] = React.useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = React.useState(false);

  React.useEffect(() => {
    if (
      columns.length > 0 &&
      !columns.some((column) => column.id === orderBy)
    ) {
      setOrderBy(columns[0].id);
    }
  }, [columns, orderBy]);

  const getRowId = React.useCallback(
    (row, index) => row[idField] ?? row.id ?? `${index}`,
    [idField],
  );

  const selectedRows = React.useMemo(
    () =>
      selected
        .map((selectedId) =>
          rows.find((row, index) => getRowId(row, index) === selectedId),
        )
        .filter(Boolean),
    [getRowId, rows, selected],
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row, index) => getRowId(row, index));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleOpenAddDialog = () => {
    setAddError('');
    setAddFormData({});
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = () => {
    if (selectedRows.length !== 1) {
      return;
    }

    setEditError('');
    setEditFormData(buildFormDataFromRow(selectedRows[0], addFields));
    setIsEditDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    if (!isSubmittingAdd) {
      setIsAddDialogOpen(false);
    }
  };

  const handleCloseEditDialog = () => {
    if (!isSubmittingEdit) {
      setIsEditDialogOpen(false);
    }
  };

  const handleAddFormChange = (fieldName, value) => {
    setAddFormData((previous) => ({
      ...previous,
      [fieldName]: value,
    }));
  };

  const handleEditFormChange = (fieldName, value) => {
    setEditFormData((previous) => ({
      ...previous,
      [fieldName]: value,
    }));
  };

  const handleSubmitAdd = async () => {
    if (!onAddRecord) {
      return;
    }

    const missingRequiredField = addFields.find((field) => {
      if (!field.required) {
        return false;
      }

      const value = addFormData[field.name];
      return (
        value === undefined || value === null || String(value).trim() === ''
      );
    });

    if (missingRequiredField) {
      setAddError(`${missingRequiredField.label} is required.`);
      return;
    }

    try {
      setAddError('');
      setIsSubmittingAdd(true);
      await onAddRecord(addFormData);
      setIsAddDialogOpen(false);
      setAddFormData({});
    } catch (submitError) {
      setAddError(submitError.message || 'Failed to add record.');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!onUpdateRecord || selectedRows.length !== 1) {
      return;
    }

    const missingRequiredField = addFields.find((field) => {
      if (!field.required) {
        return false;
      }

      const value = editFormData[field.name];
      return (
        value === undefined || value === null || String(value).trim() === ''
      );
    });

    if (missingRequiredField) {
      setEditError(`${missingRequiredField.label} is required.`);
      return;
    }

    try {
      setEditError('');
      setIsSubmittingEdit(true);
      await onUpdateRecord({ row: selectedRows[0], values: editFormData });
      setIsEditDialogOpen(false);
      setEditFormData({});
      setSelected([]);
    } catch (submitError) {
      setEditError(submitError.message || 'Failed to update record.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!onDeleteRecord || selectedRows.length === 0) {
      return;
    }

    const confirmDelete = window.confirm(
      `Delete ${selectedRows.length} selected ${selectedRows.length === 1 ? 'record' : 'records'}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await onDeleteRecord(selectedRows);
      setSelected([]);
    } catch (deleteError) {
      // eslint-disable-next-line no-alert
      window.alert(deleteError.message || 'Failed to delete record(s).');
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rows, rowsPerPage],
  );

  const tableColumnCount = Math.max(columns.length + 1, 1);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          onAddClick={handleOpenAddDialog}
          onEditClick={handleOpenEditDialog}
          onDeleteClick={handleDeleteSelected}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              headCells={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const rowId = getRowId(row, page * rowsPerPage + index);
                const isItemSelected = selected.includes(rowId);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, rowId)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={rowId}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    {columns.map((column, columnIndex) => {
                      const value = row[column.id];
                      const renderedValue = column.format
                        ? column.format(value, row)
                        : stringifyCellValue(value);

                      if (columnIndex === 0) {
                        return (
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding={column.disablePadding ? 'none' : 'normal'}
                            key={column.id}
                          >
                            {renderedValue}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={column.id}
                          align={column.numeric ? 'right' : 'left'}
                        >
                          {renderedValue}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={tableColumnCount} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />

      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{`Add ${title}`}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          {addError && <Alert severity="error">{addError}</Alert>}
          {addFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type || 'text'}
              select={Boolean(field.options)}
              required={Boolean(field.required)}
              value={addFormData[field.name] ?? ''}
              onChange={(event) =>
                handleAddFormChange(field.name, event.target.value)
              }
              fullWidth
              slotProps={
                field.type === 'datetime-local' || field.type === 'date'
                  ? {
                      inputLabel: { shrink: true },
                    }
                  : undefined
              }
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} disabled={isSubmittingAdd}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitAdd}
            disabled={isSubmittingAdd}
          >
            {isSubmittingAdd ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{`Update ${title}`}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          {editError && <Alert severity="error">{editError}</Alert>}
          {addFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type || 'text'}
              select={Boolean(field.options)}
              required={Boolean(field.required)}
              value={editFormData[field.name] ?? ''}
              onChange={(event) =>
                handleEditFormChange(field.name, event.target.value)
              }
              fullWidth
              slotProps={
                field.type === 'datetime-local' || field.type === 'date'
                  ? {
                      inputLabel: { shrink: true },
                    }
                  : undefined
              }
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={isSubmittingEdit}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitEdit}
            disabled={isSubmittingEdit}
          >
            {isSubmittingEdit ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
