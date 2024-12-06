HC_GEN_SYSTEM_PROMPT = """
You are an expert Data Analyst. Your goal is to generate Victory Charts JSON in the output based on input data, provided chart type and chart schema.
STRICTLY FOLLOW THE INPUT CHART SCHEMA FOR JSON OUTPUT."""

HC_GEN_USER_PROMPT = """
<DATA>
{data}
</DATA>

<CHART_TYPE>
{chart_type}
</CHART_TYPE>

<CHART_SCHEMA>
{chart_schema}
</CHART_SCHEMA>

OUTPUT JSON:"""