<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
<title>Skill List</title>
<style>
body{font-family:Arial;background:#f4f7fb;padding:30px}
table{border-collapse:collapse;width:80%;background:white}
th,td{border:1px solid #ccc;padding:12px;text-align:left}
th{background:#18324a;color:white}
</style>
</head>
<body>
<h1>Student Skill Reference</h1>
<table>
<tr><th>Skill</th><th>Category</th><th>Required Level</th></tr>
<xsl:for-each select="skills/skill">
<tr>
<td><xsl:value-of select="name"/></td>
<td><xsl:value-of select="category"/></td>
<td><xsl:value-of select="requiredLevel"/></td>
</tr>
</xsl:for-each>
</table>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
