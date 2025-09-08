// ✅ Export the function directly
function testRoute(req, res) {
  res.json({ message: 'Backend is working!' });
}

module.exports = testRoute;