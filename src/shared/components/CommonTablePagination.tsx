import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

interface CommonPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

export default function CommonTablePagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50],
}: CommonPaginationProps) {
  
  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={handlePageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
    
      sx={{
        color: 'rgb(156 163 175)', 
        '.MuiTablePagination-selectIcon': { color: 'rgb(156 163 175)' },
        '.MuiTablePagination-actions': { color: 'rgb(156 163 175)' },
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    />
  );
}