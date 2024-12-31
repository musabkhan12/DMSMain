import React, { useState } from 'react';

export interface IDateRangeFilterProps {
    onFilterChange: (filter: string) => void; // Callback to pass the filter query
}

export const DateRangeFilter: React.FC<IDateRangeFilterProps> = ({ onFilterChange }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

     // Generate filter query based on input
     const generateFilter = (): string => {
        if (startDate && endDate) {
            return `LastModifiedTime:Range(${startDate}..${endDate})`;
        } else if (startDate) {
            return `LastModifiedTime>=${startDate}`;
        } else if (endDate) {
            return `LastModifiedTime<=${endDate}`;
        }
        return '';
    };
    
    // Update filter query on date change
    const handleFilterChange = () => {
        // let filter = '';
        // if (startDate && endDate) {
        //     filter = `LastModifiedTime:Range(${startDate}..${endDate})`;
        // } else if (startDate) {
        //     filter = `LastModifiedTime>=${startDate}`;
        // } else if (endDate) {
        //     filter = `LastModifiedTime<=${endDate}`;
        // }

        // onFilterChange(filter); // Pass filter to parent
    };

    // Handle Apply button click
    const handleApply = () => {
        const filter = generateFilter();
        onFilterChange(filter); // Pass the filter query
    };


    return (
        <div className="container mt-3">
            <h5>Filter by Published Date</h5>
            <div className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            handleFilterChange();
                        }}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            handleFilterChange();
                        }}
                    />
                </div>
                <div className="col-md-12 mt-3">
                    <button className="btn btn-primary" onClick={handleApply}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

