$(function () {
    fetchArticle()
    // to get value from input
    $('#searchArticle').on('keyup', function () {
        console.log($('#searchArticle').val());

        searchArticle($('#searchArticle').val())


    })

    $('#callModal').on('click', function () {
        $('#modalArticle').modal('show') //popup modal when btn clicked
        $('#modalTitle').text('Add')
        //set value blank to all input
        $('#title').val("")
        $('#desc').val("")
        $('#image').val("")
    })
    $('#save').on('click', function () {
        console.log($('#title').val());
        let article = {
            TITLE: $('#title').val(),
            DESCRIPTION: $('#desc').val(),
            IMAGE: $('#image').val()
        }
        //  addArticle(article)
        if ($('modalTitle').text() == "Add") {
            addArticle(article)
        } else {
            updateArticle(article, $('#aid').val())
        }
    })
})

function searchArticle(title) {
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?title=${title}&page=1&limit=15`,
        method: 'get',
        success: function (res) {
            appendToTable(res.DATA)
        },
        error: function (er) {
            console.log(er);
        }
    })
}


function updateArticle(article, id) {
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles/${id}`,
        method: 'put',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
        },
        data: JSON.stringify(article),
        success: function (res) {
            console.log(res);
            fetchArticle()
            $('#modalArticle').modal('hide') //hide modal

        },
        error: function (er) {
            console.log(er);

        }
    })
}

function editArticle(btnEdit) {
    //call modal 
    $('#modalArticle').modal('show')
    $('#modalTitle').text('Edit')
    //get value
    let title = $(btnEdit).parent().siblings().eq(0).text()
    let desc = $(btnEdit).parent().siblings().eq(1).text()
    let imageURL = $(btnEdit).parent().siblings().eq(3).text()
    console.log(imageURL)
    $('#title').val(title)
    $('#desc').val(desc)
    $('#image').val(imageURL)
    $('#aid').val($(btnEdit).attr('data-id'))

}

function addArticle(article) {
    console.log("add");
    
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles`,
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
        },
        data: JSON.stringify(article),
        success: function (res) {
            console.log(res);
            fetchArticle()
            $('#modalArticle').modal('hide') //hide modal

        },
        error: function (er) {
            console.log(er);

        }
    })
}



function fetchArticle() {
    $.ajax({
        url: 'http://110.74.194.124:15011/v1/api/articles?page=1&limit=15',
        method: 'GET',
        success: function (res) {
            console.log(res)
            appendToTable(res.DATA)
        },
        error: function (er) {
            console.log(er);
        }
    })
}

function appendToTable(articles) {
    let content = ''
    // loop articles then show to table
    for (a in articles) {
        content += `
        <tr>
            <th scope="row">${articles[a].TITLE}</th>
            <td>${articles[a].DESCRIPTION}</td>
            <td>${formatDate(articles[a].CREATED_DATE)}</td>
            <td><img src=${articles[a].IMAGE} width='100' height='100'/></td>
            <td>
                <button class='btn btn-outline-success waves' onclick='goToDetail(${articles[a].ID})'>View</button>
                <button class='btn btn-outline-danger waves' onclick="deleteArticle(${articles[a].ID})">delete</button>
                <button class='btn btn-outline-danger waves' onclick="editArticle(this)" data-id=${articles[a].ID}>Edit</button>
            </td>
        </tr>

        `
    }
    $('tbody').html(content)
    console.log('append')
}
function formatDate(createDate) {
    let year = createDate.substring(0, 4)
    let month = createDate.substring(4, 6)
    let day = createDate.substring(6, 8)
    let date = [year, month, day]
    return date.join('/')
}
function goToDetail(id) {
    window.location.href = `detail.html?id=${id}`
}




function deleteArticle(aritlceID) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `http://110.74.194.124:15011/v1/api/articles/${aritlceID}`,
                method: 'delete',
                success: function (res) {
                    console.log(res)
                    fetchArticle()
                },
                error: function (er) {
                    console.log(er);
                }
            })
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
}

