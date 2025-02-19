<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Users</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- DataTables CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
</head>

<body>
    <x-app-layout>
        <div class="container mt-5">
            <table id="users-table" class="display" style="width: 100%;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Roles</th>
                        <th>Permissions</th>
                        <th>Edit Roles</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($users as $user)
                    <tr>
                        <td>{{ $user->id }}</td>
                        <td>{{ $user->name }}</td>
                        <td>
                            @foreach ($user->roles as $role)
                            <span class="badge bg-primary">{{ $role->name }}</span>
                            @endforeach
                        </td>
                        <td>
                            @foreach ($user->roles as $role)
                                @foreach ($role->permissions as $permission)
                                <span class="badge bg-success">{{ $permission->name }}</span>
                                @endforeach
                            @endforeach
                        </td>
                        <td>
                            <label for="roles">
                                <select name="roles" id="roles">
                                    <optgroup>
                                        <option value="Admin">Admin</option>
                                        <option value="Editor">Editor</option>
                                        <option value="User">User</option>
                                    </optgroup>
                                </select>
                            </label>
                            <button  id="SaveRole" type="button" class="btn btn-info ml- SaveRoleButton" data-item-id="{{ $role->id }}">
                            Save
                        </button>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

        </div>



        <script src="{{ asset('users.js') }}"></script>
</body>
</x-app-layout>

</html>