# Chart Data Templates

class HCSchemas:
    BAR_SCHEMA = {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "choice": {
                            "type": "string"
                        },
                        "percentage": {
                            "type": "number"
                        }
                    }
                }
            },
            "title": {
                "type": "string"
            }
        },
        "required": ["data", "title"]
    }

    COLUMN_SCHEMA = {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "choice": {
                            "type": "string"
                        },
                        "percentage": {
                            "type": "number"
                        }
                    }
                }
            },
            "title": {
                "type": "string"
            }
        },
        "required": ["data", "title"]
    }

    GROUPED_COLUMN_SCHEMA = {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "group": {
                            "type": "string"
                        },
                        "choices": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "choice": {
                                        "type": "string"
                                    },
                                    "percentage": {
                                        "type": "number"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "choiceColors": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "title": {
                "type": "string"
            }
        },
        "required": ["data", "choiceColors", "title"]
    }

    GROUPED_BAR_SCHEMA = {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "group": {
                            "type": "string"
                        },
                        "choices": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "choice": {
                                        "type": "string"
                                    },
                                    "percentage": {
                                        "type": "number"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "choiceColors": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "title": {
                "type": "string"
            }
        },
        "required": ["data", "choiceColors", "title"]
    }

    PIE_SCHEMA = {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "choice": {
                            "type": "string"
                        },
                        "percentage": {
                            "type": "number"
                        }
                    }
                }
            },
            "choiceColors": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "title": {
                "type": "string"
            }
        },
        "required": ["data", "choiceColors", "title"]
    }

    STACKED_BAR_SCHEMA = {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "description": "Stacked Bar Data where ideally the likert scale choices are cosidered as options",
                "items": {
                    "type": "object",
                    "properties": {
                        "choice": {
                            "type": "string"
                        },
                        "percentages": {
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "options": {
                            "type": "array",
                            "description": "Ideally the likert scale choices are cosidered as options",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "choiceColors": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "title": {
                "type": "string"
            }
        },
        "required": ["data", "choiceColors", "title"]
    }

    STACKED_COLUMN_SCHEMA = {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "description": "Stacked Column Data where ideally the likert scale choices are cosidered as options",
                    "properties": {
                        "choice": {
                            "type": "string"
                        },
                        "percentages": {
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "options": {
                            "type": "array",
                            "description": "Ideally the likert scale choices are cosidered as options",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "choiceColors": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "title": {
                "type": "string"
            }
        },
        "required": ["data", "choiceColors", "title"]
    }

    HEATMAP_SCHEMA = {
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "group": {
                            "type": "string"
                        },
                        "choices": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "choice": {
                                        "type": "string"
                                    },
                                    "percentage": {
                                        "type": "number"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "title": {
                "type": "string"
            }
        },
        "required": ["data", "title"]
    }


class HCHTMLTemplate:
    BAR_HTML_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </head>
    <body>

    <div id="container" style="width:100%; height:400px;"></div>

    <script>
        var data = {data};
        // Default color for all bars
        var defaultColor = '#12284c';
        // Chart configuration
        var chartOptions = {
            chart: {
                type: 'bar',
                style: {
                    fontFamily: 'Rubik',
                    fontSize: '14px'
                }
            },
            title: {
                text: '{title}'
            },
            xAxis: {
                categories: data.map(function(data) {
                    return data.choice;
                }),
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        fontFamily: 'Rubik',
                        fontSize: '14px'
                    }
                },
                gridLineWidth: 0
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0
            },
            plotOptions: {
                bar: {
                dataLabels: {
                    enabled: true,
                    format: '{y}',
                    style: {
                        fontFamily: 'Rubik',
                        fontSize: '14px'
                    }
                },
                color: defaultColor
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
            },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    fontSize: '14px',
                    fontFamily: 'Rubik'
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Percentage',
                data: data.map(function(data) {
                return data.percentage;
                })
            }]
        };

        // Render the chart
        Highcharts.chart('container', chartOptions);
    </script>

    </body>
    </html>
    """

    COLUMN_HTML_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </head>
    <body>

    <div id="container" style="width:100%; height:400px;"></div>

    <script>
        var data = {data};
        // Default color for all bars
        var defaultColor = '#12284c';
        // Chart configuration
        var chartOptions = {
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'Rubik',
                    fontSize: '14px'
                }
            },
            title: {
                text: '{title}'
            },
            xAxis: {
                categories: data.map(function(data) {
                    return data.choice;
                }),
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        fontFamily: 'Rubik',
                        fontSize: '14px'
                    }
                },
                gridLineWidth: 0
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0
            },
            plotOptions: {
                column: {
                dataLabels: {
                    enabled: true,
                    format: '{y}',
                    style: {
                        fontFamily: 'Rubik',
                        fontSize: '14px'
                    }
                },
                color: defaultColor
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
            },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    fontSize: '14px',
                    fontFamily: 'Rubik'
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Percentage',
                data: data.map(function(data) {
                return data.percentage;
                })
            }]
        };

        // Render the chart
        Highcharts.chart('container', chartOptions);
    </script>

    </body>
    </html>
    """

    GROUPED_COLUMN_HTML_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </head>
    <body>

    <div id="container" style="width:100%; height:400px;"></div>

    <script>
        var data = {data};
        // Choice colors
        var brandColors = {choiceColors};
        // Chart configuration
        var chartOptions = {
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'Rubik',
                }
            },
            title: {
                text: '{title}'
            },
            xAxis: {
                categories: data[0].choices.map(function(choice) {
                    return choice.choice;
                }),
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        fontSize: '14px'
                    }
                },
                gridLineWidth: 0
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0
            },
            plotOptions: {
                column: {
                    grouping: true,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
            },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    fontSize: '14px',
                    fontFamily: 'Rubik'
                }
            },
            credits: {
                enabled: false
            },
            series: data.map(function(data, index) {
                return {
                    name: data.group,
                    data: data.choices.map(function(choice) {
                        return choice.percentage;
                    }),
                    color: brandColors[index % brandColors.length]
                };
            })
        };
        // Render the chart
        Highcharts.chart('container', chartOptions);
    </script>

    </body>
    </html>
    """

    GROUPED_BAR_HTML_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </head>
    <body>

    <div id="container" style="width:100%; height:400px;"></div>

    <script>
        var data = {data};
        // Choice colors
        var brandColors = {choiceColors};
        // Chart configuration
        var chartOptions = {
            chart: {
                type: 'bar',
                style: {
                    fontFamily: 'Rubik',
                }
            },
            title: {
                text: '{title}'
            },
            xAxis: {
                categories: data[0].choices.map(function(choice) {
                    return choice.choice;
                }),
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        fontSize: '14px'
                    }
                },
                gridLineWidth: 0
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0
            },
            plotOptions: {
                bar: {
                    grouping: true,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
            },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    fontSize: '14px',
                    fontFamily: 'Rubik'
                }
            },
            credits: {
                enabled: false
            },
            series: data.map(function(data, index) {
                return {
                    name: data.group,
                    data: data.choices.map(function(choice) {
                        return choice.percentage;
                    }),
                    color: brandColors[index % brandColors.length]
                };
            })
        };
        // Render the chart
        Highcharts.chart('container', chartOptions);
    </script>

    </body>
    </html>
    """

    PIE_HTML_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </head>
    <body>

    <div id="container" style="width:100%; height:400px;"></div>

    <script>
        var data = {data};
        // Choice colors
        var brandColors = {choiceColors};
        // Chart configuration
        var chartOptions = {
            chart: {
                type: 'pie',
                style: {
                    fontFamily: 'Rubik',
                }
            },
            title: {
                text: '{title}'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.y}'
                    },
                    colors: brandColors,
                    showInLegend: true
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.name}: <b>{point.y}</b><br/>'
            },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    fontSize: '14px',
                    fontFamily: 'Rubik'
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Choices',
                data: data.map(function(data) {
                    return {
                        name: data.choice,
                        y: data.percentage
                    };
                })
            }]
        };
        // Render the chart
        Highcharts.chart('container', chartOptions);
    </script>

    </body>
    </html>
    """

    STACKED_BAR_HTML_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </head>
    <body>

    <div id="container" style="width:100%; height:400px;"></div>

    <script>
        var data = {data};
        // Choice colors
        var brandColors = {choiceColors};
        // Get the Likert options from the first data object
        var options = data[0].options;
        // Chart configuration
        var chartOptions = {
            chart: {
                type: 'bar',
                style: {
                    fontFamily: 'Rubik',
                }
            },
            title: {
                text: '{title}'
            },
            xAxis: {
                categories: data.map(function(data) {
                    return data.choice;
                }),
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        fontSize: '14px',
                    }
                },
                gridLineWidth: 0
            },
            yAxis: {
                visible: false // Remove y-axis labels and title
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}'
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
            },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    fontSize: '14px',
                    fontFamily: 'Rubik'
                }
            },
            credits: {
                enabled: false
            },
            series: options.map(function(option, index) {
                return {
                    name: option,
                    data: data.map(function(data) {
                        return data.percentages[index];
                    })
                };
            })
        };
        // Render the chart
        chart = Highcharts.chart('container', chartOptions);
    </script>

    </body>
    </html>
    """

    STACKED_COLUMN_HTML_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    </head>
    <body>

    <div id="container" style="width:100%; height:400px;"></div>

    <script>
        var data = {data};
        // Choice colors
        var brandColors = {choiceColors};
        // Get the Likert options from the first data object
        var options = data[0].options;
        // Chart configuration
        var chartOptions = {
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'Rubik',
                }
            },
            title: {
                text: '{title}'
            },
            xAxis: {
                categories: data.map(function(data) {
                    return data.choice;
                }),
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        fontSize: '14px',
                    }
                },
                gridLineWidth: 0
            },
            yAxis: {
                visible: false // Remove y-axis labels and title
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}'
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
            },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    fontSize: '14px',
                    fontFamily: 'Rubik'
                }
            },
            credits: {
                enabled: false
            },
            series: options.map(function(option, index) {
                return {
                    name: option,
                    data: data.map(function(data) {
                        return data.percentages[index];
                    })
                };
            })
        };
        // Render the chart
        chart = Highcharts.chart('container', chartOptions);
    </script>

    </body>
    </html>
    """

    HEATMAP_HTML_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>
        <script src="https://code.highcharts.com/modules/heatmap.js"></script>
    </head>
    <body>

    <div id="container" style="width:100%; height:400px;"></div>

    <script>
        var data = {data};
        // Chart configuration
        var chartOptions = {
        chart: {
            type: 'heatmap',
            style: {
            fontFamily: 'Rubik'
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: data[0].choices.map(function(choice) {
                return choice.choice;
            }),
            title: {
                text: '{title}'
            },
            labels: {
                style: {
                    fontSize: '14px'
                }
            },
            gridLineWidth: 0
        },
        yAxis: {
            categories: data.map(function(data) {
                return data.group;
            }),
            title: {
                text: ''
            },
            labels: {
                style: {
                    fontSize: '14px'
                }
            },
            gridLineWidth: 0
        },
        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0] // Change if you want a different max color
        },
        plotOptions: {
            heatmap: {
                turboThreshold: Number.MAX_VALUE, // To handle large datasets
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }
        },
        tooltip: {
            formatter: function () {
            return '<b>' + this.series.yAxis.categories[this.point.y] + '</b><br>' +
                '<b>' + this.series.xAxis.categories[this.point.x] + '</b><br>' +
                '<b>Percentage: </b>' + this.point.value + '%';
            }
        },
        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            itemStyle: {
            fontFamily: 'Rubik',
            fontSize: '14px'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: data.reduce(function (arr, data, rowIndex) {
                return arr.concat(data.choices.map(function (choice, colIndex) {
                    return {
                    x: colIndex,
                    y: rowIndex,
                    value: choice.percentage
                    };
                }));
            }, [])
        }]
        };

        // Render the chart
        Highcharts.chart('container', chartOptions);
    </script>

    </body>
    </html>
    """