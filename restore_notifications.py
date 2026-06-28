import os

def restore_app():
    path = r'd:\Canteen Management System\frontend\src\App.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "setGlobalStudentNotifications={setGlobalStudentNotifications}" not in content.split("StudentDashboard")[1]:
        content = content.replace(
            "globalStudentNotifications={globalStudentNotifications} globalMenu",
            "globalStudentNotifications={globalStudentNotifications} setGlobalStudentNotifications={setGlobalStudentNotifications} globalMenu"
        )
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def restore_admin():
    path = r'd:\Canteen Management System\frontend\src\pages\admin\AdminDashboard.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    ready_replacement = """  const handleMarkReady = (orderId) => {
    const order = globalOrders.find(o => o.id === orderId);
    setGlobalOrders(globalOrders.map(o => o.id === orderId ? { ...o, status: 'Ready' } : o));
    
    if (order) {
      const newNotification = {
        id: f`ready-{order.id}-{Date.now()}`,
        email: order.email,
        date: new Date().toISOString().split('T')[0],
        message: f`Your order #{order.id} is now Ready for pickup!`,
        type: 'success'
      };
      setGlobalStudentNotifications([newNotification, ...globalStudentNotifications]);
    }
  };""".replace('f`', '`')

    if "is now Ready for pickup!" not in content:
        content = content.replace(
            "  const handleMarkReady = (orderId) => {\n    setGlobalOrders(globalOrders.map(order => order.id === orderId ? { ...order, status: 'Ready' } : order));\n  };",
            ready_replacement
        )
        
    received_replacement = """const UpdateOrders = ({ globalOrders, setGlobalOrders, globalStudentNotifications, setGlobalStudentNotifications }) => {
  const handleMarkReceived = (orderId) => {
    const order = globalOrders.find(o => o.id === orderId);
    setGlobalOrders(globalOrders.map(o => o.id === orderId ? { ...o, status: 'Received' } : o));
    
    if (order) {
      const newNotification = {
        id: f`recv-{order.id}-{Date.now()}`,
        email: order.email,
        date: new Date().toISOString().split('T')[0],
        message: f`Your order #{order.id} has been marked as Received. Enjoy your food!`,
        type: 'success'
      };
      setGlobalStudentNotifications([newNotification, ...globalStudentNotifications]);
    }
  };""".replace('f`', '`')

    if "Enjoy your food!" not in content:
        content = content.replace(
            "const UpdateOrders = ({ globalOrders, setGlobalOrders }) => {\n  const handleMarkReceived = (orderId) => {\n    setGlobalOrders(globalOrders.map(order => order.id === orderId ? { ...order, status: 'Received' } : order));\n  };",
            received_replacement
        )

    if "globalStudentNotifications={globalStudentNotifications} setGlobalStudentNotifications={setGlobalStudentNotifications}" not in content.split("UpdateOrders")[1]:
        content = content.replace(
            "<Route path=\"/update-order\" element={<UpdateOrders globalOrders={globalOrders} setGlobalOrders={setGlobalOrders} />} />",
            "<Route path=\"/update-order\" element={<UpdateOrders globalOrders={globalOrders} setGlobalOrders={setGlobalOrders} globalStudentNotifications={globalStudentNotifications} setGlobalStudentNotifications={setGlobalStudentNotifications} />} />"
        )
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def restore_student():
    path = r'd:\Canteen Management System\frontend\src\pages\student\StudentDashboard.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if "setGlobalStudentNotifications" not in content.split("StudentActiveOrders")[0]:
        content = content.replace(
            "const StudentActiveOrders = ({ orders, globalMenu, setGlobalMenu, globalOrders, setGlobalOrders, loggedInUser }) => {",
            "const StudentActiveOrders = ({ orders, globalMenu, setGlobalMenu, globalOrders, setGlobalOrders, loggedInUser, globalStudentNotifications, setGlobalStudentNotifications }) => {"
        )
        
    cancel_replacement = """                        setGlobalMenu(updatedMenu);
                        setGlobalOrders(globalOrders.filter(o => o.id !== order.id));
                        
                        const newNotification = {
                          id: f`cancel-{order.id}-{Date.now()}`,
                          email: loggedInUser?.email || 'student@crave.com',
                          date: new Date().toISOString().split('T')[0],
                          message: f`You have successfully canceled order #{order.id}. The items have been returned to the menu.`,
                          type: 'warning'
                        };
                        setGlobalStudentNotifications([newNotification, ...globalStudentNotifications]);
                      }}""".replace('f`', '`')

    if "successfully canceled order" not in content:
        content = content.replace(
            "                        setGlobalMenu(updatedMenu);\n                        setGlobalOrders(globalOrders.filter(o => o.id !== order.id));\n                      }}",
            cancel_replacement
        )

    if "const userEmail =" not in content.split("StudentNotifications")[1]:
        content = content.replace(
            "const userNotifications = globalStudentNotifications.filter(n => n.email === loggedInUser?.email);",
            "const userEmail = loggedInUser?.email || 'student@crave.com';\n  const userNotifications = globalStudentNotifications.filter(n => n.email === userEmail);"
        )

    if "setGlobalStudentNotifications" not in content.split("StudentDashboard")[2]:
        content = content.replace(
            "const StudentDashboard = ({ globalOrders, setGlobalOrders, loggedInUser, setLoggedInUser, globalUsers, setGlobalUsers, globalStudentNotifications, globalMenu, setGlobalMenu }) => {",
            "const StudentDashboard = ({ globalOrders, setGlobalOrders, loggedInUser, setLoggedInUser, globalUsers, setGlobalUsers, globalStudentNotifications, setGlobalStudentNotifications, globalMenu, setGlobalMenu }) => {"
        )

    content = content.replace(
        "notifications={globalStudentNotifications?.filter(n => n.email === loggedInUser?.email).length || readyOrdersCount}",
        "notifications={globalStudentNotifications?.filter(n => n.email === (loggedInUser?.email || 'student@crave.com')).length || readyOrdersCount}"
    )

    if "setGlobalStudentNotifications={setGlobalStudentNotifications}" not in content.split("/order")[1]:
        content = content.replace(
            "<Route path=\"/order\" element={<StudentActiveOrders orders={activeOrders} globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} globalOrders={globalOrders} setGlobalOrders={setGlobalOrders} loggedInUser={loggedInUser} />} />",
            "<Route path=\"/order\" element={<StudentActiveOrders orders={activeOrders} globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} globalOrders={globalOrders} setGlobalOrders={setGlobalOrders} loggedInUser={loggedInUser} globalStudentNotifications={globalStudentNotifications} setGlobalStudentNotifications={setGlobalStudentNotifications} />} />"
        )
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


restore_app()
restore_admin()
restore_student()

