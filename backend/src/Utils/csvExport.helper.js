/**
 * CSV Export Helper
 * Converts JSON data to CSV format for report downloads
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Optional array of column names to include (in order)
 * @returns {string} CSV formatted string
 */
const convertToCSV = (data, columns = null) => {
    if (!data || data.length === 0) {
        return '';
    }

    // Determine columns from first object if not provided
    const headers = columns || Object.keys(data[0]);

    // Build header row
    const headerRow = headers.map(escapeCSVValue).join(',');

    // Build data rows
    const dataRows = data.map(row => {
        return headers.map(header => {
            const value = getNestedValue(row, header);
            return escapeCSVValue(value);
        }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
};

/**
 * Escape special characters for CSV format
 * @param {*} value - Value to escape
 * @returns {string} Escaped value
 */
const escapeCSVValue = (value) => {
    if (value === null || value === undefined) {
        return '';
    }

    // Convert to string
    let stringValue = String(value);

    // Check if value needs quoting
    const needsQuoting = stringValue.includes(',') ||
        stringValue.includes('"') ||
        stringValue.includes('\n') ||
        stringValue.includes('\r');

    if (needsQuoting) {
        // Escape double quotes by doubling them
        stringValue = stringValue.replace(/"/g, '""');
        // Wrap in quotes
        return `"${stringValue}"`;
    }

    return stringValue;
};

/**
 * Get nested property value from object using dot notation
 * @param {Object} obj - Object to extract value from
 * @param {string} path - Path to property (e.g., 'user.name')
 * @returns {*} Value at path or undefined
 */
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
        return current?.[key];
    }, obj);
};

/**
 * Set CSV response headers
 * @param {object} res - Express response object
 * @param {string} filename - Name of the CSV file (without .csv extension)
 */
const setCSVHeaders = (res, filename) => {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
    res.setHeader('Cache-Control', 'no-cache');
};

/**
 * Convert report data to CSV and send as download
 * Usage in controller:
 * 
 * if (req.query.format === 'csv') {
 *   return sendCSVResponse(res, reportData, 'user-growth-report', ['date', 'newUsers', 'cumulativeUsers']);
 * }
 * 
 * @param {object} res - Express response object
 * @param {Array} data - Array of objects to convert
 * @param {string} filename - Name of the CSV file
 * @param {Array} columns - Optional array of column names
 */
const sendCSVResponse = (res, data, filename, columns = null) => {
    try {
        // Log CSV export
        console.log(`[CSV EXPORT] Generating CSV file: ${filename}.csv`);

        // Convert to CSV
        const csv = convertToCSV(data, columns);

        // Set headers
        setCSVHeaders(res, filename);

        // Send response
        return res.send(csv);
    } catch (error) {
        console.error('Error generating CSV:', error);
        throw error;
    }
};

/**
 * Flatten nested report data for CSV export
 * Useful for chart data with labels and datasets
 * 
 * @param {object} chartData - Chart data with labels and datasets
 * @returns {Array} Flattened array suitable for CSV
 * 
 * Example:
 * Input: { labels: ['Jan', 'Feb'], datasets: [{ label: 'Sales', data: [100, 200] }] }
 * Output: [{ period: 'Jan', Sales: 100 }, { period: 'Feb', Sales: 200 }]
 */
const flattenChartDataForCSV = (chartData) => {
    if (!chartData.labels || !chartData.datasets) {
        throw new Error('Invalid chart data format');
    }

    const flattened = chartData.labels.map((label, index) => {
        const row = { period: label };

        chartData.datasets.forEach(dataset => {
            row[dataset.label] = dataset.data[index];
        });

        return row;
    });

    return flattened;
};

module.exports = {
    convertToCSV,
    escapeCSVValue,
    getNestedValue,
    setCSVHeaders,
    sendCSVResponse,
    flattenChartDataForCSV
};
