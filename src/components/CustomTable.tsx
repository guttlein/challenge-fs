import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Link } from "react-router";
import { userType } from '../types/customTypes';
import "./CustomTable.css"

// Tipando las props del componente
interface CustomTableProps {
    users: userType[];
}

export const CustomTable: React.FC<CustomTableProps> = ({ users }) => {
    const [order, setOrder] = React.useState<("asc" | "desc" | undefined)>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof userType>('name'); // Se utilizará para saber por qué columna ordenar

    const handleRequestSort = (property: keyof userType) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortData = (array: userType[], comparator: (a: userType, b: userType) => number) => {
        const stabilizedThis = array.map((el, index) => [el, index] as [userType, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const comparator = (a: userType, b: userType) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    };

    const sortedUsers = sortData(users, comparator);

    const tableHeaders = ['Nombre', 'Usuario', 'Tel.', 'Email', 'Ciudad', 'Empresa']

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="sortable table">
                <TableHead>
                    <TableRow>
                        {tableHeaders.map((columnId) => (
                            <TableCell
                                key={columnId}
                                align="center"
                                sortDirection={orderBy === columnId ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === columnId}
                                    direction={orderBy === columnId ? order : 'asc'}
                                    onClick={() => handleRequestSort(columnId as keyof userType)}
                                >
                                    {columnId}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedUsers.map((user: userType) => (
                        <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <Link to={`/${user.id}`}>{user.name}</Link>
                            </TableCell>
                            <TableCell align="center">{user.username}</TableCell>
                            <TableCell align="center">{user.phone}</TableCell>
                            <TableCell align="center">{user.email}</TableCell>
                            <TableCell align="center">{user.address.city}</TableCell>
                            <TableCell align="center">{user.company.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
